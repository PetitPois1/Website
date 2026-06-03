/**
 * Unified Game Hub navigation for site pages (not in-game).
 * Usage: <body data-hub-page="home" class="hub-site-body">
 *        <script src="js/theme.js"></script>
 *        <link rel="stylesheet" href="css/hub-site.css">
 *        ... auth scripts ...
 *        <script src="js/hub-nav.js"></script>
 */
(function () {
  const LINKS = [
    { id: "home", href: "index.html", label: "Games" },
    { id: "about", href: "about.html", label: "About" },
    { id: "feedback", href: "feedback.html", label: "Feedback" },
    { id: "bugs", href: "bugs.html", label: "Bugs" },
    { id: "settings", href: "settings.html", label: "Settings" },
  ];

  function getActivePage() {
    const body = document.body;
    if (body && body.dataset.hubPage) return body.dataset.hubPage;
    const path = window.location.pathname.split("/").pop() || "index.html";
    if (path === "" || path === "index.html") return "home";
    if (path === "profile.html") return "profile";
    if (path === "settings.html") return "settings";
    if (path === "about.html") return "about";
    if (path === "feedback.html") return "feedback";
    if (path === "bugs.html") return "bugs";
    if (path === "upcoming.html") return "upcoming";
    return "";
  }

  function injectAuthModalIfNeeded() {
    if (document.getElementById("auth-modal")) return;
    const modal = document.createElement("div");
    modal.id = "auth-modal";
    modal.className =
      "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10001] hidden";
    modal.innerHTML = `
      <div id="auth-modal-overlay-close" class="absolute inset-0"></div>
      <div class="relative bg-slate-900/95 border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style="background:color-mix(in srgb, var(--bg-dark) 95%, transparent);border-color:var(--border-color);">
        <div class="flex items-center justify-between mb-4">
          <h2 id="auth-title" class="text-xl font-bold" style="color:var(--text-main)">Sign In</h2>
          <button id="auth-close-btn" type="button" class="text-sm px-2 py-1 rounded-full" style="color:var(--text-muted)">✕</button>
        </div>
        <p class="text-sm mb-4" style="color:var(--text-muted)">Sign in to sync progress and achievements.</p>
        <div id="auth-form-wrapper">
          <form id="auth-form" class="space-y-4">
            <div>
              <label for="auth-email" class="block text-xs font-semibold mb-1" style="color:var(--text-muted)">Email</label>
              <input id="auth-email" type="email" autocomplete="email" class="w-full px-3 py-2 rounded-lg text-sm" style="background:rgba(0,0,0,0.3);border:1px solid var(--border-color);color:var(--text-main)">
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <label for="auth-password" class="text-xs font-semibold" style="color:var(--text-muted)">Password</label>
                <button type="button" id="auth-forgot-password" class="text-[10px]" style="color:var(--primary)">Forgot?</button>
              </div>
              <input id="auth-password" type="password" autocomplete="current-password" class="w-full px-3 py-2 rounded-lg text-sm" style="background:rgba(0,0,0,0.3);border:1px solid var(--border-color);color:var(--text-main)">
            </div>
            <div id="auth-password-confirm-wrapper" class="hidden">
              <label for="auth-password-confirm" class="block text-xs font-semibold mb-1" style="color:var(--text-muted)">Confirm</label>
              <input id="auth-password-confirm" type="password" class="w-full px-3 py-2 rounded-lg text-sm" style="background:rgba(0,0,0,0.3);border:1px solid var(--border-color);color:var(--text-main)">
            </div>
            <div id="auth-error" class="text-xs text-rose-400 min-h-[1.2rem]"></div>
            <button id="auth-submit-btn" type="submit" class="w-full py-2.5 rounded-lg text-sm font-semibold text-white btn-theme-primary">Sign In</button>
          </form>
          <button id="auth-toggle-mode" type="button" class="mt-4 w-full text-center text-xs" style="color:var(--text-muted)">Need an account? Sign up</button>
        </div>
        <div id="auth-verification-sent" class="hidden">
          <p class="text-emerald-400 text-sm font-semibold mb-3">Verification email sent</p>
          <p class="text-sm mb-2" style="color:var(--text-main)">Check <strong id="auth-verification-email"></strong></p>
          <p id="auth-verification-resend-feedback" class="text-xs min-h-[1rem] mb-2"></p>
          <div class="flex gap-2">
            <button type="button" id="auth-verification-resend" class="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white btn-theme-primary">Resend</button>
            <button type="button" id="auth-verification-close" class="flex-1 py-2.5 rounded-lg text-sm font-semibold" style="background:var(--card-bg);color:var(--text-main)">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function renderNav() {
    const existing = document.getElementById("hub-site-nav");
    if (existing) existing.remove();
    document.querySelectorAll("nav.glass-nav").forEach((el) => el.remove());

    const active = getActivePage();
    const nav = document.createElement("nav");
    nav.id = "hub-site-nav";

    const linksHtml = LINKS.map(
      (l) =>
        `<a href="${l.href}" class="hub-link${active === l.id ? " is-active" : ""}">${l.label}</a>`
    ).join("");

    const mobileLinksHtml = LINKS.map(
      (l) =>
        `<a href="${l.href}" class="hub-link${active === l.id ? " is-active" : ""}">${l.label}</a>`
    ).join("");

    nav.innerHTML = `
      <div class="hub-nav-inner">
        <a href="index.html" class="hub-brand">
          <span class="hub-brand-icon">👾</span>
          <span class="hub-brand-text">GAME HUB</span>
        </a>
        <div class="hub-links">${linksHtml}</div>
        <button type="button" id="profile-button" class="hub-account-btn">
          <span id="profile-avatar" class="hub-account-avatar">?</span>
          <span id="profile-label">Sign In</span>
        </button>
        <button type="button" class="hub-menu-toggle" id="hub-menu-toggle" aria-label="Menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      <div class="hub-mobile-menu" id="hub-mobile-menu">
        ${mobileLinksHtml}
        <button type="button" id="mobile-profile-link" class="hub-link text-left" style="background:none;border:1px solid var(--border-color);border-radius:8px;padding:8px 12px;">Sign In</button>
      </div>
    `;

    document.body.prepend(nav);

    const toggle = document.getElementById("hub-menu-toggle");
    const menu = document.getElementById("hub-mobile-menu");
    if (toggle && menu) {
      toggle.onclick = () => menu.classList.toggle("is-open");
    }

    injectAuthModalIfNeeded();
    if (window.gameHubAuth && window.gameHubAuth.initAuthUI) {
      window.gameHubAuth.initAuthUI();
    }

    if (active === "profile" && document.getElementById("profile-label")) {
      document.getElementById("profile-label").textContent = "Profile";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderNav);
  } else {
    renderNav();
  }

  if (window.gameHubAuth && window.gameHubAuth.onAuthStateChanged) {
    window.gameHubAuth.onAuthStateChanged((user) => {
      if (window.gameHubTheme && window.gameHubTheme.loadFromCloud) {
        window.gameHubTheme.loadFromCloud();
      }
    });
  }
})();
