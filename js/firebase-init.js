(function () {
  // Configuration is loaded from js/firebase-config.js
  const firebaseConfig = window.gameHubConfig;

  if (!firebaseConfig) {
    console.error("[GameHub] Firebase configuration not found. Check js/firebase-config.js.");
    return;
  }

  if (!window.firebase) {
    console.error(
      "[GameHub] Firebase SDK not loaded. " +
      "Make sure firebase-app-compat.js, firebase-auth-compat.js and firebase-firestore-compat.js " +
      "are included before js/firebase-init.js."
    );
    return;
  }

  try {
    const app = firebase.apps && firebase.apps.length
      ? firebase.app()
      : firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();
    const db = firebase.firestore();

    window.gameHubFirebase = { app, auth, db };
  } catch (err) {
    console.error("[GameHub] Failed to initialize Firebase:", err);
  }
})();

