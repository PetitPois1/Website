(function () {
  // Replace these placeholder values with your real Firebase config.
  // You can find them in your Firebase console under Project Settings.
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

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

