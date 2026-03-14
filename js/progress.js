(function () {
  const firebaseRef = window.gameHubFirebase;

  const LOCAL_PROGRESS_KEY = "gamehub_progress_";
  const LOCAL_ACHIEVEMENTS_KEY = "gamehub_achievements_";

  function getUser() {
    if (!window.gameHubAuth || !window.gameHubAuth.getCurrentUser) return null;
    return window.gameHubAuth.getCurrentUser();
  }

  function getDb() {
    return firebaseRef && firebaseRef.db ? firebaseRef.db : null;
  }

  function localProgressKey(gameId) {
    return LOCAL_PROGRESS_KEY + gameId;
  }

  function localAchievementsKey(gameId) {
    return LOCAL_ACHIEVEMENTS_KEY + gameId;
  }

  function saveLocalProgress(gameId, progress) {
    try {
      const existing = loadLocalProgress(gameId) || {};
      const merged = Object.assign({}, existing, progress);
      localStorage.setItem(localProgressKey(gameId), JSON.stringify(merged));
    } catch (e) {
      console.warn("[GameHub] Unable to save local progress", e);
    }
  }

  function loadLocalProgress(gameId) {
    try {
      const raw = localStorage.getItem(localProgressKey(gameId));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("[GameHub] Unable to read local progress", e);
      return null;
    }
  }

  function saveLocalAchievements(gameId, achievementIds) {
    try {
      const unique = Array.from(new Set(achievementIds));
      localStorage.setItem(localAchievementsKey(gameId), JSON.stringify(unique));
    } catch (e) {
      console.warn("[GameHub] Unable to save local achievements", e);
    }
  }

  function loadLocalAchievements(gameId) {
    try {
      const raw = localStorage.getItem(localAchievementsKey(gameId));
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("[GameHub] Unable to read local achievements", e);
      return [];
    }
  }

  async function saveGameProgress(gameId, data) {
    if (!gameId) return;
    
    // Track current activity
    const user = getUser();
    if (user && getDb()) {
        try {
            await getDb().collection("users").doc(user.uid).set({
                currentlyPlaying: gameId,
                lastSeen: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch(e) {}
    }

    const key = `gameProgress_${gameId}`;
    localStorage.setItem(key, JSON.stringify(data));

    if (!user || !getDb()) return;

    try {
      const docRef = getDb()
        .collection("users")
        .doc(user.uid)
        .collection("progress")
        .doc(gameId);
      await docRef.set(data, { merge: true });
    } catch (e) {
      console.warn("[GameHub] Failed to save cloud progress", e);
    }
  }

  async function loadGameProgress(gameId) {
    if (!gameId) return null;

    // First try local storage for immediate feel
    const key = `gameProgress_${gameId}`;
    const local = localStorage.getItem(key);
    let localData = local ? JSON.parse(local) : null;

    const user = getUser();
    const db = getDb();
    if (!user || !db) return localData;

    try {
      const doc = await db
        .collection("users")
        .doc(user.uid)
        .collection("progress")
        .doc(gameId)
        .get();

      if (doc.exists) {
        const cloudData = doc.data();
        // Simple merge: cloud usually wins if newer, but for now just return cloud
        return cloudData;
      }
    } catch (e) {
      console.warn("[GameHub] Failed to load cloud progress", e);
    }
    return localData;
  }

  async function unlockAchievement(gameId, achievementId) {
    if (!gameId || !achievementId) return;

    const existingLocal = loadLocalAchievements(gameId);
    if (existingLocal.includes(achievementId)) {
      return;
    }

    const updated = existingLocal.concat(achievementId);
    saveLocalAchievements(gameId, updated);

    // Trigger visual notification
    if (window.gameHubAchievements && window.gameHubAchievements.notifyAchievement) {
      window.gameHubAchievements.notifyAchievement(gameId, achievementId);
    }

    const user = getUser();
    const db = getDb();
    if (!user || !db) return;

    try {
      const docRef = db
        .collection("users")
        .doc(user.uid)
        .collection("achievements")
        .doc(achievementId);

      await docRef.set(
        {
          gameId,
          unlockedAt: firebase.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );

      // Award currency based on difficulty
      let reward = 10; // Default
      if (window.gameHubAchievements && window.gameHubAchievements.definitions) {
          const gameDefs = window.gameHubAchievements.definitions[gameId] || [];
          const achDef = gameDefs.find(a => a.id === achievementId);
          if (achDef && achDef.difficulty) {
              const rewards = { easy: 10, medium: 25, hard: 50, insane: 100 };
              reward = rewards[achDef.difficulty] || 10;
          }
      }

      const userRef = db.collection("users").doc(user.uid);
      await userRef.update({
        currency: firebase.firestore.FieldValue.increment(reward),
        achievementsCount: firebase.firestore.FieldValue.increment(1)
      });
      console.log(`[GameHub] Awarded ${reward} coins for ${achievementId} (${gameId})`);
    } catch (e) {
      console.warn("[GameHub] Failed to unlock cloud achievement or award currency", e);
    }
  }

  // Playtime tracking
  let sessionStartTime = null;
  let currentGameId = null;

  function startPlayTimeTracking(gameId) {
      sessionStartTime = Date.now();
      currentGameId = gameId;
      
      // Heartbeat for "currently playing" and "last seen"
      updatePresence(gameId);
      const presenceInterval = setInterval(() => {
          if (currentGameId === gameId) {
              updatePresence(gameId);
          } else {
              clearInterval(presenceInterval);
          }
      }, 30000); // Every 30 seconds
  }

  async function updatePresence(gameId) {
      const user = getUser();
      const db = getDb();
      if (!user || !db) return;
      try {
          await db.collection("users").doc(user.uid).set({
              currentlyPlaying: gameId,
              lastSeen: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
      } catch(e) {}
  }

  async function stopPlayTimeTracking() {
      if (!sessionStartTime || !currentGameId) return;
      
      const durationMs = Date.now() - sessionStartTime;
      const durationSec = Math.floor(durationMs / 1000);
      
      const user = getUser();
      const db = getDb();
      
      // Update local storage
      const localKey = `playtime_${currentGameId}`;
      const existingLocal = parseInt(localStorage.getItem(localKey) || "0");
      localStorage.setItem(localKey, (existingLocal + durationSec).toString());

      if (user && db) {
          try {
              const userRef = db.collection("users").doc(user.uid);
              const playtimeField = `playtime.${currentGameId}`;
              await userRef.update({
                  [playtimeField]: firebase.firestore.FieldValue.increment(durationSec),
                  currentlyPlaying: null,
                  lastSeen: firebase.firestore.FieldValue.serverTimestamp()
              });
          } catch(e) {
              console.warn("[GameHub] Failed to save cloud playtime", e);
          }
      }

      sessionStartTime = null;
      currentGameId = null;
  }

  // Listen for page visibility changes to handle backgrounding
  document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
          stopPlayTimeTracking();
      } else if (currentGameId) {
          sessionStartTime = Date.now();
      }
  });

  // Handle page unload
  window.addEventListener('beforeunload', stopPlayTimeTracking);

  async function getCurrency() {
    const user = getUser();
    const db = getDb();
    if (!user || !db) return 0;

    try {
      const doc = await db.collection("users").doc(user.uid).get();
      return doc.exists ? (doc.data().currency || 0) : 0;
    } catch (e) {
      console.warn("[GameHub] Failed to load currency", e);
      return 0;
    }
  }

  async function spendCurrency(amount) {
    const user = getUser();
    const db = getDb();
    if (!user || !db) return false;

    try {
      const userRef = db.collection("users").doc(user.uid);
      const doc = await userRef.get();
      const current = doc.exists ? (doc.data().currency || 0) : 0;
      
      if (current < amount) return false;

      await userRef.update({
        currency: firebase.firestore.FieldValue.increment(-amount)
      });
      return true;
    } catch (e) {
      console.warn("[GameHub] Failed to spend currency", e);
      return false;
    }
  }

  async function getUserAchievements(gameId) {
    const local = loadLocalAchievements(gameId);

    const user = getUser();
    const db = getDb();
    if (!user || !db) {
      return local;
    }

    try {
      const colRef = db
        .collection("users")
        .doc(user.uid)
        .collection("achievements");

      let query = colRef;
      if (gameId) {
        query = query.where("gameId", "==", gameId);
      }
      const snap = await query.get();
      const cloudIds = [];
      snap.forEach((doc) => {
        cloudIds.push(doc.id);
      });
      const merged = Array.from(new Set(local.concat(cloudIds)));
      if (gameId) {
        saveLocalAchievements(gameId, merged);
      }
      return merged;
    } catch (e) {
      console.warn("[GameHub] Failed to load cloud achievements", e);
      return local;
    }
  }

  window.gameHubProgress = {
    saveGameProgress,
    loadGameProgress,
    unlockAchievement,
    getUserAchievements,
    getCurrency,
    spendCurrency,
    startPlayTimeTracking,
    stopPlayTimeTracking
  };
})();

