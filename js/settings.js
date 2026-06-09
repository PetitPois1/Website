/**
 * Global Game Hub Settings — apply on every page via <head>.
 */
(function () {
  // Default values
  const DEFAULTS = {
    audio: {
      masterVolume: 80,
      muteAll: false,
      muteMusic: false
    },
    gameplay: {
      defaultDifficulty: "Medium",
      defaultCategory: "All Games",
      hideBetaGames: false
    },
    privacy: {
      showOnlineStatus: true,
      allowFriendRequests: "Everyone",
      profileVisibility: "Everyone"
    },
    accessibility: {
      reducedMotion: false,
      largerText: false
    }
  };

  // Storage keys
  const STORAGE_KEYS = {
    audio: "gamehub_audio",
    gameplay: "gamehub_gameplay",
    privacy: "gamehub_privacy",
    accessibility: "gamehub_accessibility"
  };

  let currentSettings = loadAllFromLocal();

  function loadFromLocal(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        return { ...DEFAULTS[key.replace("gamehub_", "")], ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn("[GameHub] settings load failed for", key, e);
    }
    return { ...DEFAULTS[key.replace("gamehub_", "")] };
  }

  function loadAllFromLocal() {
    return {
      audio: loadFromLocal(STORAGE_KEYS.audio),
      gameplay: loadFromLocal(STORAGE_KEYS.gameplay),
      privacy: loadFromLocal(STORAGE_KEYS.privacy),
      accessibility: loadFromLocal(STORAGE_KEYS.accessibility)
    };
  }

  function saveToLocal(settings) {
    localStorage.setItem(STORAGE_KEYS.audio, JSON.stringify(settings.audio));
    localStorage.setItem(STORAGE_KEYS.gameplay, JSON.stringify(settings.gameplay));
    localStorage.setItem(STORAGE_KEYS.privacy, JSON.stringify(settings.privacy));
    localStorage.setItem(STORAGE_KEYS.accessibility, JSON.stringify(settings.accessibility));
    currentSettings = { ...settings };
    applyAccessibilitySettings(settings.accessibility);
  }

  function applyAccessibilitySettings(accessibility) {
    if (!document.documentElement) return;
    if (accessibility.reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
    if (accessibility.largerText) {
      document.documentElement.classList.add("large-text");
    } else {
      document.documentElement.classList.remove("large-text");
    }
  }

  async function saveToCloud(settings) {
    const user = window.gameHubAuth && window.gameHubAuth.getCurrentUser ? window.gameHubAuth.getCurrentUser() : null;
    const db = window.gameHubFirebase && window.gameHubFirebase.db;
    if (!user || !db) return Promise.resolve();
    return db.collection("users").doc(user.uid).set(
      {
        settings: {
          audioSettings: settings.audio,
          gameplaySettings: settings.gameplay,
          privacySettings: settings.privacy,
          accessibilitySettings: settings.accessibility
        }
      },
      { merge: true }
    );
  }

  async function loadFromCloud() {
    const user = window.gameHubAuth && window.gameHubAuth.getCurrentUser ? window.gameHubAuth.getCurrentUser() : null;
    const db = window.gameHubFirebase && window.gameHubFirebase.db;
    if (!user || !db) return null;
    try {
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists && doc.data().settings) {
        const cloudSettings = doc.data().settings;
        const settings = {
          audio: { ...DEFAULTS.audio, ...cloudSettings.audioSettings },
          gameplay: { ...DEFAULTS.gameplay, ...cloudSettings.gameplaySettings },
          privacy: { ...DEFAULTS.privacy, ...cloudSettings.privacySettings },
          accessibility: { ...DEFAULTS.accessibility, ...cloudSettings.accessibilitySettings }
        };
        saveToLocal(settings);
        return settings;
      }
    } catch (e) {
      console.warn("[GameHub] cloud settings load failed", e);
    }
    return null;
  }

  function getSettings() {
    return { ...currentSettings };
  }

  function getDefaults() {
    return { ...DEFAULTS };
  }

  // Apply accessibility settings immediately
  applyAccessibilitySettings(currentSettings.accessibility);

  // Expose audio settings as window.gameHubAudio
  window.gameHubAudio = {
    get masterVolume() { return currentSettings.audio.masterVolume; },
    get muteAll() { return currentSettings.audio.muteAll; },
    get muteMusic() { return currentSettings.audio.muteMusic; }
  };

  window.gameHubSettings = {
    DEFAULTS,
    getSettings,
    getDefaults,
    saveToLocal,
    saveToCloud,
    loadFromCloud,
    loadAllFromLocal
  };
})();
