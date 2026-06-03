/**
 * Global Game Hub theme — apply on every page via progress.js or directly in <head>.
 */
(function () {
  const STORAGE_KEY = "gamehub_theme";

  const PRESETS = {
    default: {
      id: "default",
      name: "Default",
      bg: "#0f172a",
      primary: "#8b5cf6",
      primaryDark: "#6d28d9",
      text: "#f8fafc",
      textMuted: "#94a3b8",
      card: "rgba(30, 41, 59, 0.7)",
      border: "rgba(255, 255, 255, 0.1)",
      nav: "rgba(15, 23, 42, 0.88)",
      glow: "rgba(139, 92, 246, 0.15)",
      glowSecondary: "rgba(59, 130, 246, 0.1)",
    },
    dark: {
      id: "dark",
      name: "Pitch Black",
      bg: "#000000",
      primary: "#ffffff",
      primaryDark: "#e5e7eb",
      text: "#e5e7eb",
      textMuted: "#9ca3af",
      card: "rgba(17, 17, 17, 0.9)",
      border: "rgba(255, 255, 255, 0.08)",
      nav: "rgba(0, 0, 0, 0.92)",
      glow: "rgba(255, 255, 255, 0.04)",
      glowSecondary: "rgba(255, 255, 255, 0.02)",
    },
    neon: {
      id: "neon",
      name: "Neon",
      bg: "#000000",
      primary: "#00f2ff",
      primaryDark: "#00c4cc",
      text: "#e0ffff",
      textMuted: "#67e8f9",
      card: "rgba(0, 242, 255, 0.06)",
      border: "rgba(0, 242, 255, 0.28)",
      nav: "rgba(0, 10, 16, 0.94)",
      glow: "rgba(0, 242, 255, 0.12)",
      glowSecondary: "rgba(0, 242, 255, 0.06)",
    },
    pastel: {
      id: "pastel",
      name: "Pastel",
      bg: "#fff1f2",
      primary: "#f472b6",
      primaryDark: "#ec4899",
      text: "#831843",
      textMuted: "#9d174d",
      card: "rgba(255, 255, 255, 0.92)",
      border: "rgba(251, 207, 232, 0.9)",
      nav: "rgba(255, 255, 255, 0.92)",
      glow: "rgba(244, 114, 182, 0.15)",
      glowSecondary: "rgba(251, 207, 232, 0.4)",
    },
    ocean: {
      id: "ocean",
      name: "Ocean",
      bg: "#0c1929",
      primary: "#0ea5e9",
      primaryDark: "#0284c7",
      text: "#e0f2fe",
      textMuted: "#7dd3fc",
      card: "rgba(14, 116, 144, 0.25)",
      border: "rgba(14, 165, 233, 0.2)",
      nav: "rgba(8, 25, 45, 0.92)",
      glow: "rgba(14, 165, 233, 0.15)",
      glowSecondary: "rgba(6, 182, 212, 0.1)",
    },
    sunset: {
      id: "sunset",
      name: "Sunset",
      bg: "#1a0a12",
      primary: "#f97316",
      primaryDark: "#ea580c",
      text: "#fff7ed",
      textMuted: "#fdba74",
      card: "rgba(124, 45, 18, 0.35)",
      border: "rgba(249, 115, 22, 0.25)",
      nav: "rgba(26, 10, 18, 0.92)",
      glow: "rgba(249, 115, 22, 0.18)",
      glowSecondary: "rgba(236, 72, 153, 0.1)",
    },
    forest: {
      id: "forest",
      name: "Forest",
      bg: "#0a1612",
      primary: "#22c55e",
      primaryDark: "#16a34a",
      text: "#ecfdf5",
      textMuted: "#86efac",
      card: "rgba(20, 83, 45, 0.35)",
      border: "rgba(34, 197, 94, 0.22)",
      nav: "rgba(8, 22, 16, 0.92)",
      glow: "rgba(34, 197, 94, 0.12)",
      glowSecondary: "rgba(16, 185, 129, 0.08)",
    },
    crimson: {
      id: "crimson",
      name: "Crimson",
      bg: "#14080c",
      primary: "#f43f5e",
      primaryDark: "#e11d48",
      text: "#ffe4e6",
      textMuted: "#fda4af",
      card: "rgba(136, 19, 55, 0.35)",
      border: "rgba(244, 63, 94, 0.25)",
      nav: "rgba(24, 8, 12, 0.92)",
      glow: "rgba(244, 63, 94, 0.15)",
      glowSecondary: "rgba(190, 18, 60, 0.1)",
    },
    midnight: {
      id: "midnight",
      name: "Midnight",
      bg: "#0f0a1e",
      primary: "#818cf8",
      primaryDark: "#6366f1",
      text: "#eef2ff",
      textMuted: "#a5b4fc",
      card: "rgba(49, 46, 129, 0.35)",
      border: "rgba(129, 140, 248, 0.22)",
      nav: "rgba(12, 10, 28, 0.92)",
      glow: "rgba(99, 102, 241, 0.18)",
      glowSecondary: "rgba(139, 92, 246, 0.1)",
    },
  };

  function applyTheme(theme) {
    if (!theme || !theme.bg) return;
    const root = document.documentElement;
    root.style.setProperty("--bg-dark", theme.bg);
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--primary-dark", theme.primaryDark || theme.primary);
    root.style.setProperty("--text-main", theme.text);
    root.style.setProperty("--text-muted", theme.textMuted || "#94a3b8");
    root.style.setProperty("--card-bg", theme.card);
    root.style.setProperty("--border-color", theme.border);
    root.style.setProperty("--nav-bg", theme.nav || "rgba(15, 23, 42, 0.88)");
    root.style.setProperty("--theme-glow", theme.glow || "rgba(139, 92, 246, 0.15)");
    root.style.setProperty("--theme-glow-secondary", theme.glowSecondary || "rgba(59, 130, 246, 0.1)");

    const applyBody = () => {
      if (!document.body) return;
      document.body.style.backgroundColor = theme.bg;
      document.body.style.color = theme.text;
      document.body.dataset.hubTheme = theme.id || "custom";
    };
    if (document.body) applyBody();
    else document.addEventListener("DOMContentLoaded", applyBody);
  }

  function applySaved() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) applyTheme(JSON.parse(raw));
    } catch (e) {
      console.warn("[GameHub] theme load failed", e);
    }
  }

  function saveTheme(theme, syncCloud) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    applyTheme(theme);
    if (!syncCloud) return Promise.resolve();
    const user =
      window.gameHubAuth && window.gameHubAuth.getCurrentUser
        ? window.gameHubAuth.getCurrentUser()
        : null;
    const db = window.gameHubFirebase && window.gameHubFirebase.db;
    if (!user || !db) return Promise.resolve();
    return db.collection("users").doc(user.uid).set(
      { settings: { theme } },
      { merge: true }
    );
  }

  async function loadFromCloud() {
    const user =
      window.gameHubAuth && window.gameHubAuth.getCurrentUser
        ? window.gameHubAuth.getCurrentUser()
        : null;
    const db = window.gameHubFirebase && window.gameHubFirebase.db;
    if (!user || !db) return null;
    try {
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists && doc.data().settings && doc.data().settings.theme) {
        const theme = doc.data().settings.theme;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
        applyTheme(theme);
        return theme;
      }
    } catch (e) {
      console.warn("[GameHub] cloud theme load failed", e);
    }
    return null;
  }

  function getPreset(key) {
    return PRESETS[key] ? { ...PRESETS[key] } : null;
  }

  // Apply immediately so first paint uses saved theme
  applySaved();

  window.gameHubTheme = {
    PRESETS,
    applyTheme,
    applySaved,
    saveTheme,
    loadFromCloud,
    getPreset,
  };
})();
