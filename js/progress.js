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

  async function unlockAchievement(gameId, achievementId) {
    if (!gameId || !achievementId) return;

    const existingLocal = loadLocalAchievements(gameId);
    if (existingLocal.includes(achievementId)) {
      return;
    }

    const user = getUser();
    const db = getDb();

    // If signed in, check cloud before notifying or adding locally
    if (user && db) {
      try {
        const docRef = db
          .collection("users")
          .doc(user.uid)
          .collection("achievements")
          .doc(achievementId);

        const doc = await docRef.get();
        if (doc.exists) {
          // Sync local if missing but skip notification/reward
          if (!existingLocal.includes(achievementId)) {
            saveLocalAchievements(gameId, existingLocal.concat(achievementId));
          }
          return;
        }

        // Proceed with unlock
        await docRef.set({
          gameId,
          unlockedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Award currency based on difficulty
        let reward = 10;
        if (window.gameHubAchievements && window.gameHubAchievements.getAchievementValue) {
          reward = window.gameHubAchievements.getAchievementValue(gameId, achievementId);
        }

        const userRef = db.collection("users").doc(user.uid);
        await userRef.update({
          currency: firebase.firestore.FieldValue.increment(reward),
          achievementsCount: firebase.firestore.FieldValue.increment(1)
        });
        
        // Save locally after cloud success
        saveLocalAchievements(gameId, existingLocal.concat(achievementId));

        // Trigger visual notification
        if (window.gameHubAchievements && window.gameHubAchievements.notifyAchievement) {
          window.gameHubAchievements.notifyAchievement(gameId, achievementId, reward);
        }
        
        console.log(`[GameHub] Awarded ${reward} coins for achievement:`, achievementId);

        // Check for "The Perfectionist"
        if (achievementId !== 'perfectionist') {
          checkPerfectionist();
        }
      } catch (e) {
        console.warn("[GameHub] Failed to unlock cloud achievement or award currency", e);
      }
    } else {
      // Guest mode - just local
      saveLocalAchievements(gameId, existingLocal.concat(achievementId));
      if (window.gameHubAchievements && window.gameHubAchievements.notifyAchievement) {
        window.gameHubAchievements.notifyAchievement(gameId, achievementId);
      }
      if (achievementId !== 'perfectionist') {
        checkPerfectionist();
      }
    }
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

    // Initial status update
    db.collection("users").doc(user.uid).set({
        currentlyPlaying: gameId || "Exploring Hub",
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Update every minute
    playTimeInterval = setInterval(async () => {
        const currentUser = getUser();
        if (!currentUser) {
            clearInterval(playTimeInterval);
            return;
        }

        try {
            const userRef = db.collection("users").doc(currentUser.uid);
            
            // Increment total play time
            const updates = {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            if (gameId) {
                // Update game-specific play time
                const gameTimeKey = `playTime_${gameId}`;
                updates[gameTimeKey] = firebase.firestore.FieldValue.increment(1); // minutes
            }

            await userRef.update(updates);
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

  // Global Theme Application
  (function applyGlobalTheme() {
    const saved = localStorage.getItem('gamehub_theme');
    if (saved) {
      try {
        const theme = JSON.parse(saved);
        const root = document.documentElement;
        root.style.setProperty('--bg-dark', theme.bg);
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--text-main', theme.text);
        root.style.setProperty('--card-bg', theme.card);
        root.style.setProperty('--border-color', theme.border);
        
        // Apply custom styles to body directly if needed
        document.addEventListener('DOMContentLoaded', () => {
          document.body.style.backgroundColor = theme.bg;
          document.body.style.color = theme.text;
        });
      } catch(e) {}
    }
  })();

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
    getCurrency,
    spendCurrency,
    startHeartbeat,
    getLeaderboard,
    syncAllHighScoresToLeaderboards
  };
})();

