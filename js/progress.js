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

  async function saveGameProgress(gameId, progress) {
    if (!gameId || !progress) return;

    saveLocalProgress(gameId, progress);

    const user = getUser();
    const db = getDb();
    if (!user || !db) return;

    try {
      const docRef = db
        .collection("users")
        .doc(user.uid)
        .collection("progress")
        .doc(gameId);

      await docRef.set(
        Object.assign({}, progress, {
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }),
        { merge: true }
      );
    } catch (e) {
      console.warn("[GameHub] Failed to save cloud progress", e);
    }
  }

  async function loadGameProgress(gameId) {
    const local = loadLocalProgress(gameId) || {};

    const user = getUser();
    const db = getDb();
    if (!user || !db) {
      return local;
    }

    try {
      const docRef = db
        .collection("users")
        .doc(user.uid)
        .collection("progress")
        .doc(gameId);

      const snap = await docRef.get();
      if (!snap.exists) {
        return local;
      }
      const data = snap.data() || {};
      const merged = Object.assign({}, local, data);
      saveLocalProgress(gameId, merged);
      return merged;
    } catch (e) {
      console.warn("[GameHub] Failed to load cloud progress", e);
      return local;
    }
  }

  async function unlockAchievement(gameId, achievementId) {
    if (!gameId || !achievementId) return;

    const existingLocal = loadLocalAchievements(gameId);
    if (existingLocal.includes(achievementId)) {
      return;
    }

    const updated = existingLocal.concat(achievementId);
    saveLocalAchievements(gameId, updated);

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
    } catch (e) {
      console.warn("[GameHub] Failed to unlock cloud achievement", e);
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
    getUserAchievements
  };
})();

