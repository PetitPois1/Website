/**
 * Shared Game Hub chrome, auth modal, and progress helpers for individual game pages.
 * Include after firebase-init.js, progress.js, achievements.js, and auth.js.
 */
(function () {
  const PATH_TO_GAME_ID = {
    "snake_game.html": "snake",
    "tic-tac-toe.html": "tic-tac-toe",
    "pong_game.html": "pong",
    "clicker_game.html": "clicker",
    "Blockblast.html": "blockblast",
    "tower-defence.html": "tower-defence",
    "blackjack.html": "blackjack",
    "Pac-Man.html": "pacman",
    "Flappybird.html": "flappy",
    "poker.html": "poker",
    "Mining.html": "mining",
    "Loopy.html": "loopy",
    "NeonDash.html": "neondash",
    "BrickBreaker.html": "brick",
    "FPS.html": "island",
    "SwordbattleIO.html": "swordbattle",
    "Voxelcraft.html": "voxelcraft",
    "Stack.html": "stack",
    "Pool.html": "pool",
    "ForPiece.html": "forpiece",
    "hades-v1.1.html": "Hades",
    "3DFlappyBird.html": "3DFlappyBird",
    "asteroids.html": "Astroids",
    "UltimateRPS.html": "UltimateRPS",
    "Chess.html": "chess",
  };

  /** Full-screen games: no body padding; per-game CSS offsets top HUD. */
  const IMMERSIVE_LAYOUT_GAMES = new Set([
    "voxelcraft",
    "pool",
    "stack",
    "island",
    "swordbattle",
    "NeonDash",
    "3DFlappyBird",
    "Astroids",
    "Hades",
    "ForPiece",
  ]);

  function resolveGameId() {
    const meta = document.querySelector('meta[name="game-hub-id"]');
    if (meta && meta.content) return meta.content.trim();
    const path = window.location.pathname.split("/").pop() || "";
    return PATH_TO_GAME_ID[path] || null;
  }

  function injectStyles() {
    if (document.getElementById("game-hub-chrome-styles")) return;
    const style = document.createElement("style");
    style.id = "game-hub-chrome-styles";
    style.textContent = `
      :root { --gh-chrome-height: 48px; }
      body.game-hub-chrome-active:not(.game-hub-layout-immersive) {
        padding-top: var(--gh-chrome-height) !important;
      }
      body.game-hub-layout-immersive.game-hub-chrome-active {
        padding-top: 0 !important;
      }
      #game-hub-chrome {
        position: fixed; top: 0; left: 0; right: 0; z-index: 100000;
        height: var(--gh-chrome-height);
        box-sizing: border-box;
        display: flex; align-items: center; justify-content: space-between; gap: 8px;
        padding: 0 14px;
        background: var(--nav-bg, rgba(15, 23, 42, 0.94));
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
        font-family: 'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
      }
      #game-hub-chrome .gh-brand {
        display: flex; align-items: center; gap: 8px;
        color: #f8fafc; text-decoration: none; font-weight: 800; font-size: 13px;
        letter-spacing: 0.04em; flex-shrink: 0;
      }
      #game-hub-chrome .gh-brand span { opacity: 0.85; }
      #game-hub-chrome .gh-actions {
        display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center;
        gap: 6px; justify-content: flex-end; flex-shrink: 1; min-width: 0;
      }
      #game-hub-chrome .gh-btn,
      #game-hub-chrome button.gh-btn {
        width: auto !important; min-width: 0 !important; max-width: none !important;
        flex: 0 0 auto !important; display: inline-flex !important;
        align-items: center; justify-content: center;
        white-space: nowrap;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(30, 41, 59, 0.8);
        color: #e2e8f0;
        font-size: 11px; font-weight: 700;
        padding: 6px 10px; border-radius: 8px;
        cursor: pointer; transition: border-color 0.15s, background 0.15s;
        box-shadow: none !important;
        font-family: inherit;
      }
      #game-hub-chrome .gh-btn:hover { border-color: var(--primary, #8b5cf6); background: color-mix(in srgb, var(--primary) 18%, transparent); }
      #game-hub-chrome .gh-btn.gh-accent { background: var(--primary, #7c3aed); border-color: var(--primary, #7c3aed); color: #fff; }
      #game-hub-chrome .gh-btn.gh-accent:hover { filter: brightness(1.08); }
      #auth-modal.hidden { display: none !important; }
      #auth-modal { display: flex; }
      #auth-modal .gh-auth-panel {
        position: relative;
        background: rgba(15, 23, 42, 0.98);
        border: 1px solid rgba(100, 116, 139, 0.4);
        border-radius: 16px;
        width: 100%; max-width: 400px; margin: 16px;
        padding: 24px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      }
      #auth-modal input {
        width: 100%; padding: 10px 12px; border-radius: 8px;
        background: rgba(30, 41, 59, 0.9); border: 1px solid #475569;
        color: #f1f5f9; font-size: 14px; box-sizing: border-box;
      }
      #auth-modal label { display: block; font-size: 11px; font-weight: 600; color: #94a3b8; margin-bottom: 4px; }
      body.game-hub-game-voxelcraft #static-ui { top: calc(10px + var(--gh-chrome-height)); }
      body.game-hub-game-pool .hud { padding-top: calc(12px + var(--gh-chrome-height)); }
      body.game-hub-game-pool #announcer { top: calc(80px + var(--gh-chrome-height)); }
      body.game-hub-game-stack #score-display { top: calc(8% + var(--gh-chrome-height)); }
      body.game-hub-game-stack #combo-text { top: calc(22% + var(--gh-chrome-height)); }
      body.game-hub-game-3DFlappyBird #hud-top,
      body.game-hub-game-3dflappybird #hud-top {
        top: calc(12px + var(--gh-chrome-height));
        padding-top: 4px;
      }
      @media (max-width: 520px) {
        #game-hub-chrome .gh-btn { font-size: 10px; padding: 5px 8px; }
        #game-hub-chrome .gh-brand-text { display: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function injectAuthModal() {
    if (document.getElementById("auth-modal")) return;
    const modal = document.createElement("div");
    modal.id = "auth-modal";
    modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm items-center justify-center z-[100001] hidden";
    modal.innerHTML = `
      <div id="auth-modal-overlay-close" class="absolute inset-0"></div>
      <div class="gh-auth-panel">
        <div class="flex items-center justify-between mb-4" style="display:flex;justify-content:space-between;margin-bottom:16px;">
          <h2 id="auth-title" style="margin:0;font-size:20px;color:#fff;font-weight:800;">Sign In</h2>
          <button id="auth-close-btn" type="button" class="gh-btn">✕</button>
        </div>
        <p style="color:#94a3b8;font-size:13px;margin:0 0 16px;">Sign in to sync progress and appear on leaderboards.</p>
        <div id="auth-form-wrapper">
          <form id="auth-form" style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <label for="auth-email">Email</label>
              <input id="auth-email" type="email" autocomplete="email" placeholder="you@example.com">
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <label for="auth-password">Password</label>
                <button type="button" id="auth-forgot-password" style="background:none;border:none;color:#a78bfa;font-size:10px;cursor:pointer;">Forgot?</button>
              </div>
              <input id="auth-password" type="password" autocomplete="current-password" placeholder="••••••••">
            </div>
            <div id="auth-password-confirm-wrapper" class="hidden" style="display:none;">
              <label for="auth-password-confirm">Confirm Password</label>
              <input id="auth-password-confirm" type="password" autocomplete="new-password" placeholder="Repeat password">
            </div>
            <div id="auth-error" style="color:#fb7185;font-size:12px;min-height:1.2rem;"></div>
            <button id="auth-submit-btn" type="submit" class="gh-btn gh-primary" style="width:100%;padding:12px;">Sign In</button>
          </form>
          <button id="auth-toggle-mode" type="button" style="margin-top:12px;width:100%;background:none;border:none;color:#94a3b8;font-size:12px;cursor:pointer;">Need an account? Sign up</button>
        </div>
        <div id="auth-verification-sent" class="hidden" style="display:none;">
          <p style="color:#4ade80;font-weight:700;margin-bottom:8px;">Verification email sent</p>
          <p style="color:#e2e8f0;font-size:13px;">Check <strong id="auth-verification-email"></strong> and verify before signing in.</p>
          <p id="auth-verification-resend-feedback" style="font-size:12px;min-height:1rem;"></p>
          <div style="display:flex;gap:8px;margin-top:12px;">
            <button type="button" id="auth-verification-resend" class="gh-btn gh-primary" style="flex:1;">Resend</button>
            <button type="button" id="auth-verification-close" class="gh-btn" style="flex:1;">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    if (window.gameHubAuth && window.gameHubAuth.initAuthUI) {
      window.gameHubAuth.initAuthUI();
    }
  }

  function injectChrome(gameId) {
    if (document.getElementById("game-hub-chrome")) return;
    injectStyles();
    injectAuthModal();

    const achCount =
      window.gameHubAchievements && window.gameHubAchievements.getAchievementCount
        ? window.gameHubAchievements.getAchievementCount(gameId)
        : 0;
    const chrome = document.createElement("header");
    chrome.id = "game-hub-chrome";
    chrome.innerHTML = `
      <a href="index.html" class="gh-brand" title="Back to games">
        <span style="font-size:16px;">←</span>
        <span class="gh-brand-text">Games</span>
      </a>
      <div class="gh-actions">
        ${achCount > 0 ? `<button type="button" class="gh-btn" id="gh-achievements-btn">Achievements</button>` : ""}
        <button type="button" class="gh-btn gh-accent" id="gh-signin-btn">Sign In</button>
      </div>
    `;
    document.body.prepend(chrome);
    document.body.classList.add("game-hub-chrome-active");
    const safeId = gameId.replace(/[^a-z0-9_-]/gi, "_");
    document.body.classList.add("game-hub-game-" + safeId);
    document.body.classList.add("game-hub-game-" + gameId);
    if (IMMERSIVE_LAYOUT_GAMES.has(gameId)) {
      document.body.classList.add("game-hub-layout-immersive");
    }
    const layoutMeta = document.querySelector('meta[name="game-hub-layout"]');
    if (layoutMeta && layoutMeta.content === "immersive") {
      document.body.classList.add("game-hub-layout-immersive");
    }

    const signInBtn = document.getElementById("gh-signin-btn");

    function updateAuthUI(user) {
      if (!signInBtn) return;
      if (user) {
        signInBtn.textContent = "Profile";
        signInBtn.title = "Your profile";
        signInBtn.onclick = () => {
          window.location.href = "profile.html";
        };
      } else {
        signInBtn.textContent = "Sign In";
        signInBtn.title = "Sign in to sync progress";
        signInBtn.onclick = () => {
          if (window.gameHubAuth && window.gameHubAuth.openAuthModal) {
            window.gameHubAuth.openAuthModal();
          }
        };
      }
    }

    if (window.gameHubAuth && window.gameHubAuth.onAuthStateChanged) {
      window.gameHubAuth.onAuthStateChanged(updateAuthUI);
    }

    const achBtn = document.getElementById("gh-achievements-btn");
    if (achBtn && window.gameHubAchievements) {
      achBtn.onclick = () => {
        window.gameHubAchievements.showAchievementsModal(gameId);
      };
    }

    if (gameId && window.gameHubProgress && window.gameHubProgress.saveGameProgress) {
      window.gameHubProgress.saveGameProgress(gameId, { lastPlayed: Date.now() });
    }
  }

  async function loadHighScore(gameId, localKey) {
    let score = 0;
    if (localKey) {
      score = parseInt(localStorage.getItem(localKey), 10) || 0;
    }
    if (gameId && window.gameHubProgress && window.gameHubProgress.loadGameProgress) {
      try {
        const progress = await window.gameHubProgress.loadGameProgress(gameId);
        if (progress && typeof progress.highScore === "number") {
          score = Math.max(score, progress.highScore);
          if (localKey) localStorage.setItem(localKey, String(score));
        }
      } catch (e) {
        console.warn("[GameHub] loadHighScore failed", e);
      }
    }
    return score;
  }

  async function saveHighScore(gameId, score, localKey) {
    if (localKey) localStorage.setItem(localKey, String(score));
    if (gameId && window.gameHubProgress && window.gameHubProgress.saveGameProgress) {
      try {
        await window.gameHubProgress.saveGameProgress(gameId, { highScore: score });
      } catch (e) {
        console.warn("[GameHub] saveHighScore failed", e);
      }
    }
    if (gameId && window.gameHubAchievements && window.gameHubAchievements.checkThresholdAchievements) {
      window.gameHubAchievements.checkThresholdAchievements(gameId, score);
    }
  }

  async function saveProgress(gameId, data) {
    if (gameId && window.gameHubProgress && window.gameHubProgress.saveGameProgress) {
      try {
        await window.gameHubProgress.saveGameProgress(gameId, data);
      } catch (e) {
        console.warn("[GameHub] saveProgress failed", e);
      }
    }
  }

  async function loadProgress(gameId) {
    if (!gameId || !window.gameHubProgress || !window.gameHubProgress.loadGameProgress) {
      return null;
    }
    try {
      return await window.gameHubProgress.loadGameProgress(gameId);
    } catch (e) {
      console.warn("[GameHub] loadProgress failed", e);
      return null;
    }
  }

  function init() {
    const gameId = resolveGameId();
    if (!gameId) return;
    injectChrome(gameId);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("load", () => {
    const gameId = resolveGameId();
    const actions = document.querySelector("#game-hub-chrome .gh-actions");
    if (!gameId || !actions || document.getElementById("gh-achievements-btn")) return;
    const achCount =
      window.gameHubAchievements && window.gameHubAchievements.getAchievementCount
        ? window.gameHubAchievements.getAchievementCount(gameId)
        : 0;
    if (achCount > 0) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gh-btn";
      btn.id = "gh-achievements-btn";
      btn.textContent = "Achievements";
      btn.onclick = () => window.gameHubAchievements.showAchievementsModal(gameId);
      actions.insertBefore(btn, actions.querySelector("#gh-signin-btn"));
    }
  });

  window.gameHubCommon = {
    resolveGameId,
    loadHighScore,
    saveHighScore,
    saveProgress,
    loadProgress,
    injectChrome,
  };
})();
