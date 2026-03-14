(function () {
  const firebaseRef = window.gameHubFirebase;

  let currentUser = null;
  const userListeners = [];

  function notifyUserChanged(user) {
    currentUser = user || null;
    userListeners.forEach((cb) => {
      try {
        cb(currentUser);
      } catch (e) {
        console.error("[GameHub] auth listener error", e);
      }
    });
    updateAuthUI(currentUser);
  }

  function onAuthStateChanged(callback) {
    if (typeof callback === "function") {
      userListeners.push(callback);
      callback(currentUser);
    }
  }

  function getCurrentUser() {
    return currentUser;
  }

  async function signUpWithEmailPassword(email, password) {
    if (!firebaseRef || !firebaseRef.auth) {
      throw new Error("Auth is not available.");
    }
    const result = await firebaseRef.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    return result.user;
  }

  async function signInWithEmailPassword(email, password) {
    if (!firebaseRef || !firebaseRef.auth) {
      throw new Error("Auth is not available.");
    }
    const result = await firebaseRef.auth.signInWithEmailAndPassword(
      email,
      password
    );
    return result.user;
  }

  async function signOutCurrentUser() {
    if (!firebaseRef || !firebaseRef.auth) return;
    await firebaseRef.auth.signOut();
    if (window.location.pathname.includes("profile.html")) {
      window.location.href = "index.html";
    }
  }

  function updateAuthUI(user) {
    const profileButton = document.getElementById("profile-button");
    const profileAvatar = document.getElementById("profile-avatar");
    const profileLabel = document.getElementById("profile-label");
    const mobileProfileLink = document.getElementById("mobile-profile-link");

    const isLoggedIn = !!user;
    
    // Attempt to fetch custom user data for the avatar
    let customUserData = null;
    if (isLoggedIn && window.gameHubFirebase && window.gameHubFirebase.db) {
        window.gameHubFirebase.db.collection("users").doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data.avatar && profileAvatar) {
                    renderAvatarSVG(profileAvatar, data.avatar, "w-full h-full");
                } else if (profileAvatar) {
                    const initial = (data.username || user.displayName || user.email || "?")[0]?.toUpperCase();
                    profileAvatar.textContent = initial;
                }
            }
        }).catch(e => console.warn("Nav avatar load failed", e));
    }

    const initial =
      (user && (user.displayName || user.email || "?")[0]?.toUpperCase()) ||
      "?";

    if (profileAvatar && !isLoggedIn) {
      profileAvatar.textContent = initial;
    }
    if (profileLabel) {
      profileLabel.textContent = isLoggedIn ? "Profile" : "Sign In";
    }

    // Helper to render the same SVG as profile page
    function renderAvatarSVG(container, config, classes) {
        const mouths = {
            smile: "M40 65 Q50 75 60 65",
            flat: "M40 65 L60 65",
            surprised: "M45 70 A5 5 0 1 1 55 70 A5 5 0 1 1 45 70"
        };
        container.innerHTML = `
            <svg viewBox="0 0 100 100" class="${classes}">
                <circle cx="50" cy="50" r="40" fill="${config.base}" />
                <g>
                    <circle cx="40" cy="45" r="5" fill="white" />
                    <circle cx="40" cy="45" r="2" fill="black" />
                    <circle cx="60" cy="45" r="5" fill="white" />
                    <circle cx="60" cy="45" r="2" fill="black" />
                </g>
                <path d="${mouths[config.mouth] || mouths.smile}" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" />
            </svg>
        `;
    }
    if (mobileProfileLink) {
      mobileProfileLink.textContent = isLoggedIn ? "Profile" : "Sign In";
    }

    if (profileButton) {
      profileButton.onclick = () => {
        if (isLoggedIn) {
          window.location.href = "profile.html";
        } else {
          openAuthModal();
        }
      };
    }
    if (mobileProfileLink) {
      mobileProfileLink.onclick = (e) => {
        e.preventDefault();
        if (isLoggedIn) {
          window.location.href = "profile.html";
        } else {
          openAuthModal();
        }
      };
    }
  }

  function openAuthModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) {
      modal.classList.remove("hidden");
    }
  }

  function closeAuthModal() {
    const modal = document.getElementById("auth-modal");
    const errorEl = document.getElementById("auth-error");
    if (modal) {
      modal.classList.add("hidden");
    }
    if (errorEl) errorEl.textContent = "";
  }

  function wireAuthModal() {
    const modal = document.getElementById("auth-modal");
    if (!modal) return;

    const overlayClose = document.getElementById("auth-modal-overlay-close");
    const closeBtn = document.getElementById("auth-close-btn");
    const form = document.getElementById("auth-form");
    const toggleModeBtn = document.getElementById("auth-toggle-mode");
    const titleEl = document.getElementById("auth-title");
    const submitBtn = document.getElementById("auth-submit-btn");
    const errorEl = document.getElementById("auth-error");
    const confirmWrapper = document.getElementById("auth-password-confirm-wrapper");
    const confirmInput = document.getElementById("auth-password-confirm");

    let mode = "login"; // or "signup"

    function renderMode() {
      if (!titleEl || !submitBtn || !toggleModeBtn) return;
      if (mode === "login") {
        titleEl.textContent = "Sign In";
        submitBtn.textContent = "Sign In";
        toggleModeBtn.textContent = "Need an account? Sign up";
        if (confirmWrapper) confirmWrapper.classList.add("hidden");
      } else {
        titleEl.textContent = "Create Account";
        submitBtn.textContent = "Sign Up";
        toggleModeBtn.textContent = "Have an account? Sign in";
        if (confirmWrapper) confirmWrapper.classList.remove("hidden");
      }
      if (errorEl) errorEl.textContent = "";
    }

    if (toggleModeBtn) {
      toggleModeBtn.onclick = (e) => {
        e.preventDefault();
        mode = mode === "login" ? "signup" : "login";
        renderMode();
      };
    }

    if (overlayClose) {
      overlayClose.onclick = (e) => {
        if (e.target === overlayClose) closeAuthModal();
      };
    }
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        closeAuthModal();
      };
    }

    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        if (!firebaseRef || !firebaseRef.auth) {
          if (errorEl) {
            errorEl.textContent =
              "Sign-in is not available. Configure Firebase first.";
          }
          return;
        }
        const emailInput = document.getElementById("auth-email");
        const passwordInput = document.getElementById("auth-password");
        if (!emailInput || !passwordInput) return;

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput ? confirmInput.value : "";

        if (!email || !password) {
          if (errorEl) errorEl.textContent = "Please enter email and password.";
          return;
        }
        if (mode === "signup" && password !== confirmPassword) {
          if (errorEl) errorEl.textContent = "Passwords do not match.";
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = mode === "login" ? "Signing In..." : "Signing Up...";
        if (errorEl) errorEl.textContent = "";

        try {
          if (mode === "login") {
            await signInWithEmailPassword(email, password);
          } else {
            await signUpWithEmailPassword(email, password);
          }
          closeAuthModal();
        } catch (err) {
          console.error("[GameHub] auth error", err);
          if (errorEl) {
            errorEl.textContent =
              (err && err.message) || "Something went wrong. Please try again.";
          }
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = mode === "login" ? "Sign In" : "Sign Up";
        }
      };
    }

    renderMode();
  }

  function initAuthUI() {
    if (firebaseRef && firebaseRef.auth && !firebaseRef._authListenerAttached) {
      firebaseRef.auth.onAuthStateChanged((user) => {
        notifyUserChanged(user);
      });
      firebaseRef._authListenerAttached = true;
    }
    wireAuthModal();

    const signOutBtn = document.getElementById("profile-signout-btn");
    if (signOutBtn) {
      signOutBtn.onclick = async (e) => {
        e.preventDefault();
        await signOutCurrentUser();
      };
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initAuthUI();
  });

  window.gameHubAuth = {
    onAuthStateChanged,
    getCurrentUser,
    signUpWithEmailPassword,
    signInWithEmailPassword,
    signOutCurrentUser,
    initAuthUI,
    openAuthModal,
    closeAuthModal
  };
})();

