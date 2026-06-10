(function () {
    const firebaseRef = window.gameHubFirebase;

    const LOCAL_PROGRESS_KEY = "gamehub_progress_";
    const LOCAL_ACHIEVEMENTS_KEY = "gamehub_achievements_";
    
    // Cache for user data to reduce repeated reads
    let cachedUserDoc = null;
    let cachedUserDocExpiry = 0;

  function getUser() {
    if (!window.gameHubAuth || !window.gameHubAuth.getCurrentUser) return null;
    return window.gameHubAuth.getCurrentUser();
  }

  function getDb() {
    return firebaseRef && firebaseRef.db ? firebaseRef.db : null;
  }

  async function getCachedUserDoc() {
    const user = getUser();
    const db = getDb();
    if (!user || !db) return null;

    const now = Date.now();
    if (cachedUserDoc && now < cachedUserDocExpiry) {
      return cachedUserDoc;
    }

    try {
      const doc = await db.collection("users").doc(user.uid).get();
      cachedUserDoc = doc;
      cachedUserDocExpiry = now + 60000; // Cache for 1 minute
      return doc;
    } catch (e) {
      console.warn("[GameHub] Failed to fetch user doc:", e);
      return null;
    }
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
            const settings = window.gameHubSettings ? window.gameHubSettings.getSettings() : window.gameHubSettings.getDefaults();
            const updateObj = {};
            if (settings.privacy.showOnlineStatus) {
                updateObj.currentlyPlaying = gameId;
                updateObj.lastSeen = firebase.firestore.FieldValue.serverTimestamp();
            }
            if (Object.keys(updateObj).length > 0) {
                await getDb().collection("users").doc(user.uid).set(updateObj, { merge: true });
            }
        } catch(e) {}
    }

    const key = `gameProgress_${gameId}`;
    localStorage.setItem(key, JSON.stringify(data));

    if (!user || !getDb()) return;

    try {
      const db = getDb();
      const userDoc = await db.collection("users").doc(user.uid).get();
      const username = userDoc.exists ? (userDoc.data().username || user.displayName || user.email.split('@')[0]) : (user.displayName || user.email.split('@')[0]);

      const docRef = db
        .collection("users")
        .doc(user.uid)
        .collection("progress")
        .doc(gameId);
      await docRef.set(data, { merge: true });

      // Update Leaderboards if it's a high score
      if (data.highScore || data.totalEarned || (data.player && data.player.stats && data.player.stats.maxDepth)) {
        const score = data.highScore || data.totalEarned || (data.player && data.player.stats && data.player.stats.maxDepth);
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const monthStr = dateStr.substring(0, 7); // YYYY-MM
        
        const leaderboardData = {
          uid: user.uid,
          username: username,
          score: score,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        const lbRef = db.collection("leaderboards").doc(gameId);
        
        // All Time
        await lbRef.collection("alltime").doc(user.uid).set(leaderboardData);
        
        // Monthly
        await lbRef.collection("monthly").doc(`${monthStr}_${user.uid}`).set({
          ...leaderboardData,
          period: monthStr
        });

        // Daily
        await lbRef.collection("daily").doc(`${dateStr}_${user.uid}`).set({
          ...leaderboardData,
          period: dateStr
        });
      }
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

  function resolveAchievementReward(gameId, achievementId) {
    if (window.gameHubAchievements && window.gameHubAchievements.getAchievementValue) {
      return window.gameHubAchievements.getAchievementValue(gameId, achievementId);
    }
    return 10;
  }

  async function unlockAchievement(gameId, achievementId, options = {}) {
    if (!gameId || !achievementId) return;

    const silent = options.silent === true;
    const existingLocal = loadLocalAchievements(gameId);
    const user = getUser();
    const db = getDb();
    const reward = resolveAchievementReward(gameId, achievementId);

    // Signed in: cloud is source of truth; still upload guest progress not yet synced
    if (user && db) {
      try {
        const docRef = db
          .collection("users")
          .doc(user.uid)
          .collection("achievements")
          .doc(achievementId);

        const doc = await docRef.get();
        if (doc.exists) {
          if (!existingLocal.includes(achievementId)) {
            saveLocalAchievements(gameId, existingLocal.concat(achievementId));
          }
          return;
        }

        await docRef.set({
          gameId,
          reward,
          unlockedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        const userRef = db.collection("users").doc(user.uid);
        await userRef.update({
          currency: firebase.firestore.FieldValue.increment(reward),
          achievementsCount: firebase.firestore.FieldValue.increment(1),
        });

        saveLocalAchievements(gameId, existingLocal.concat(achievementId));

      // Add XP equal to coin reward
      if (window.gameHubXP && window.gameHubXP.addXP) {
        window.gameHubXP.addXP(reward, 'achievement');
      }

      if (!silent && window.gameHubAchievements && window.gameHubAchievements.notifyAchievement) {
        window.gameHubAchievements.notifyAchievement(gameId, achievementId, reward);
      }

      console.log(`[GameHub] Awarded ${reward} coins for achievement:`, achievementId);

        if (achievementId !== "perfectionist") {
          checkPerfectionist();
        }
      } catch (e) {
        console.warn("[GameHub] Failed to unlock cloud achievement or award currency", e);
      }
      return;
    }

    // Guest: local only (coins awarded after sign-in via sync)
    if (existingLocal.includes(achievementId)) return;

    saveLocalAchievements(gameId, existingLocal.concat(achievementId));
    if (!silent && window.gameHubAchievements && window.gameHubAchievements.notifyAchievement) {
      window.gameHubAchievements.notifyAchievement(gameId, achievementId, reward);
    }
    if (achievementId !== "perfectionist") {
      checkPerfectionist();
    }
  }

  /** Push guest/local unlocks to Firestore and grant coins once per achievement. */
  async function syncAchievementsToAccount() {
    const user = getUser();
    const db = getDb();
    if (!user || !db || !window.gameHubAchievements) return;

    const allDefs = window.gameHubAchievements.getDefinitions();
    const gameIds = Object.keys(allDefs).filter((id) => id !== "global");
    const batch = db.batch();
    let totalCoinsToAdd = 0;
    let achievementsToUnlockCount = 0;

    for (const gameId of gameIds) {
      const localIds = loadLocalAchievements(gameId);
      for (const achId of localIds) {
        // First check if achievement is already unlocked in cloud
        const achRef = db.collection("users").doc(user.uid).collection("achievements").doc(achId);
        const achDoc = await achRef.get();
        if (!achDoc.exists) {
          // Unlock the achievement
          const reward = resolveAchievementReward(gameId, achId);
          batch.set(achRef, {
            gameId,
            reward,
            unlockedAt: firebase.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
          totalCoinsToAdd += reward;
          achievementsToUnlockCount++;
        }
      }
    }

    // Update user's coins and achievement count
    if (achievementsToUnlockCount > 0) {
      const userRef = db.collection("users").doc(user.uid);
      batch.set(userRef, {
        currency: firebase.firestore.FieldValue.increment(totalCoinsToAdd),
        achievementsCount: firebase.firestore.FieldValue.increment(achievementsToUnlockCount),
      }, { merge: true });

      // Commit the batch!
      await batch.commit();
      console.log(`[GameHub] Synced ${achievementsToUnlockCount} achievements, awarded ${totalCoinsToAdd} coins!`);
    }

    try {
      window.dispatchEvent(new CustomEvent("gamehub:achievements-synced"));
    } catch (_) { /* ignore */ }
  }

  function findAchievementDef(allDefs, gameId, achievementId) {
    const inGame = (allDefs[gameId] || []).find((d) => d.id === achievementId);
    if (inGame) return { gameId, def: inGame };
    for (const gid of Object.keys(allDefs)) {
      const def = (allDefs[gid] || []).find((d) => d.id === achievementId);
      if (def) return { gameId: gid, def };
    }
    return null;
  }

  async function getAllUserAchievementsDetailed() {
    if (!window.gameHubAchievements) return [];

    const allDefs = window.gameHubAchievements.getDefinitions();
    const getReward =
      window.gameHubAchievements.getCoinReward ||
      ((def) => resolveAchievementReward("", def && def.id));

    const byId = new Map();

    function addEntry(gameId, achievementId, extra = {}) {
      const resolved = findAchievementDef(allDefs, gameId, achievementId);
      if (!resolved) return;
      const defaultReward = getReward(resolved.def);
      byId.set(achievementId, {
        id: achievementId,
        gameId: resolved.gameId,
        name: resolved.def.name,
        description: resolved.def.description,
        difficulty: resolved.def.difficulty || "easy",
        reward: typeof extra.reward === "number" ? extra.reward : defaultReward,
        unlockedAt: extra.unlockedAt || null,
        source: extra.source || "local",
      });
    }

    Object.keys(allDefs).forEach((gameId) => {
      if (gameId === "global") return;
      loadLocalAchievements(gameId).forEach((achId) => addEntry(gameId, achId, { source: "local" }));
    });

    const globalLocal = loadLocalAchievements("global");
    globalLocal.forEach((achId) => addEntry("global", achId, { source: "local" }));

    const user = getUser();
    const db = getDb();
    if (user && db) {
      try {
        const snap = await db
          .collection("users")
          .doc(user.uid)
          .collection("achievements")
          .get();
        snap.forEach((doc) => {
          const data = doc.data() || {};
          const gid = data.gameId || "global";
          addEntry(gid, doc.id, {
            source: "cloud",
            reward: typeof data.reward === "number" ? data.reward : undefined,
            unlockedAt: data.unlockedAt || null,
          });
        });
      } catch (e) {
        console.warn("[GameHub] Failed to load achievement details", e);
      }
    }

    return Array.from(byId.values());
  }

  async function checkPerfectionist() {
    const user = getUser();
    const db = getDb();
    if (!user || !db || !window.gameHubAchievements) return;

    try {
      const allDefs = window.gameHubAchievements.getDefinitions();
      let totalAchRequired = 0;
      Object.keys(allDefs).forEach(gameId => {
        if (gameId !== 'global') {
          totalAchRequired += allDefs[gameId].length;
        }
      });

      const userDoc = await db.collection("users").doc(user.uid).get();
      const currentCount = userDoc.exists ? (userDoc.data().achievementsCount || 0) : 0;

      if (currentCount >= totalAchRequired) {
        // Double check by fetching all achievement IDs
        const achSnap = await db.collection("users").doc(user.uid).collection("achievements").get();
        if (achSnap.size >= totalAchRequired) {
          unlockAchievement('global', 'perfectionist');
        }
      }
    } catch (e) {
      console.warn("[GameHub] Perfectionist check failed", e);
    }
  }

  // Play Time and Status Tracking
  let playTimeInterval = null;
  function startHeartbeat(gameId) {
    if (playTimeInterval) clearInterval(playTimeInterval);
    
    const user = getUser();
    const db = getDb();
    if (!user || !db) return;

    const settings = window.gameHubSettings ? window.gameHubSettings.getSettings() : window.gameHubSettings.getDefaults();

    // Initial status update
    const initialUpdate = {};
    if (settings.privacy.showOnlineStatus) {
        initialUpdate.currentlyPlaying = gameId || "Exploring Hub";
        initialUpdate.lastSeen = firebase.firestore.FieldValue.serverTimestamp();
    }
    if (Object.keys(initialUpdate).length > 0) {
        db.collection("users").doc(user.uid).set(initialUpdate, { merge: true });
    }

    // Update every minute
    playTimeInterval = setInterval(async () => {
        const currentUser = getUser();
        if (!currentUser) {
            clearInterval(playTimeInterval);
            return;
        }

        try {
            const userRef = db.collection("users").doc(currentUser.uid);
            const currentSettings = window.gameHubSettings ? window.gameHubSettings.getSettings() : window.gameHubSettings.getDefaults();
            
            // Increment total play time
            const updates = {};
            
            if (currentSettings.privacy.showOnlineStatus) {
                updates.lastSeen = firebase.firestore.FieldValue.serverTimestamp();
            }
            
            if (gameId) {
                // Update game-specific play time
                const gameTimeKey = `playTime_${gameId}`;
                updates[gameTimeKey] = firebase.firestore.FieldValue.increment(1); // minutes
            }

            if (Object.keys(updates).length > 0) {
                await userRef.update(updates);
            }
        } catch (e) {
            console.warn("[GameHub] Heartbeat failed", e);
        }
    }, 60000); // 1 minute
  }

  // Auto-start heartbeat if we are on a game page
  const path = window.location.pathname;
  const gameMatch = path.match(/\/([^\/]+)\.html/);
  if (gameMatch) {
    const gameId = gameMatch[1].toLowerCase().replace(/_game$/, "");
    // Wait for auth to be ready
    setTimeout(() => startHeartbeat(gameId), 2000);
  } else if (path.endsWith("/") || path.endsWith("index.html")) {
    setTimeout(() => startHeartbeat(null), 2000);
  }

  // Theme applied by js/theme.js (loaded before this file on hub + game pages)
  if (window.gameHubTheme && window.gameHubTheme.applySaved) {
    window.gameHubTheme.applySaved();
  }

  async function getCurrency() {
    const user = getUser();
    const db = getDb();
    if (!user || !db) return 0;

    try {
      const doc = await getCachedUserDoc();
      return doc?.exists ? (doc.data().currency || 0) : 0;
    } catch (e) {
      console.warn("[GameHub] Failed to load currency", e);
      return 0;
    }
  }

  async function addCoins(amount) {
    const user = getUser();
    const db = getDb();
    if (!user || !db) {
      // Guest mode: just log or do nothing
      console.log(`[GameHub] Would add ${amount} coins if signed in`);
      return false;
    }

    try {
      const userRef = db.collection("users").doc(user.uid);
      await userRef.update({
        currency: firebase.firestore.FieldValue.increment(amount)
      });
      return true;
    } catch (e) {
      console.warn("[GameHub] Failed to add currency", e);
      return false;
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

  async function getLeaderboard(gameId, type = "alltime", scope = "everyone") {
    const db = getDb();
    if (!db) return [];
    
    const user = getUser();
    let query = db.collection("leaderboards").doc(gameId).collection(type).orderBy("score", "desc").limit(50);
    
    if (scope === "friends" && user) {
        // First get friend IDs
        const friendsSnap = await db.collection("users").doc(user.uid).collection("friends").get();
        const friendIds = [user.uid]; // Include self
        friendsSnap.forEach(doc => friendIds.push(doc.id));
        
        // Firestore 'in' operator supports up to 10 IDs. For more, we'd need multiple queries or client-side filtering.
        // For simplicity, we'll use 'in' for the first 10, or filter client-side if more.
        if (friendIds.length <= 10) {
            query = query.where("uid", "in", friendIds);
        } else {
            // Fetch more and filter client-side
            const snap = await query.limit(100).get();
            const entries = [];
            snap.forEach(doc => {
                if (friendIds.includes(doc.data().uid)) {
                    entries.push(doc.data());
                }
            });
            return entries;
        }
    }
    
    try {
        const snap = await query.get();
        const entries = [];
        snap.forEach(doc => entries.push(doc.data()));
        return entries;
    } catch (e) {
        console.warn("[GameHub] Leaderboard fetch failed", e);
        return [];
    }
  }

  async function syncAllHighScoresToLeaderboards() {
    const user = getUser();
    const db = getDb();
    if (!user || !db) return;

    const games = [
      { id: "snake", key: "highScore" },
      { id: "blockblast", key: "highScore" },
      { id: "clicker", key: "totalEarned" },
      { id: "flappy", key: "highScore" },
      { id: "mining", key: "player.stats.maxDepth" },
      { id: "brick", key: "highScore" },
      { id: "blackjack", key: "bestMoney" },
      { id: "stack", key: "highScore" }
    ];

    try {
      const userDoc = await db.collection("users").doc(user.uid).get();
      if (!userDoc.exists) return;
      
      const userData = userDoc.data();
      const username = userData.username || user.displayName || user.email.split('@')[0];

      for (const game of games) {
        const progressDoc = await db.collection("users").doc(user.uid).collection("progress").doc(game.id).get();
        if (progressDoc.exists) {
          const data = progressDoc.data();
          let score = 0;
          
          if (game.key.includes('.')) {
            const parts = game.key.split('.');
            let val = data;
            for (const part of parts) {
              val = val ? val[part] : null;
            }
            score = val || 0;
          } else {
            score = data[game.key] || 0;
          }

          if (score > 0) {
            const lbRef = db.collection("leaderboards").doc(game.id).collection("alltime").doc(user.uid);
            const lbDoc = await lbRef.get();
            
            if (!lbDoc.exists || lbDoc.data().score < score) {
              await lbRef.set({
                uid: user.uid,
                username: username,
                score: score,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
              }, { merge: true });
              console.log(`[GameHub] Migrated ${game.id} score to All Time leaderboard: ${score}`);
            }
          }
        }
      }
    } catch (e) {
      console.warn("[GameHub] High score migration failed", e);
    }
  }

  window.gameHubProgress = {
    saveGameProgress,
    loadGameProgress,
    unlockAchievement,
    getUserAchievements,
    getAllUserAchievementsDetailed,
    syncAchievementsToAccount,
    getCurrency,
    spendCurrency,
    addCoins,
    startHeartbeat,
    getLeaderboard,
    syncAllHighScoresToLeaderboards,
  };
})();

