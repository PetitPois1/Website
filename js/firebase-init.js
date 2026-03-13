(function () {
  // Replace these placeholder values with your real Firebase config.
  // You can find them in your Firebase console under Project Settings.
  const firebaseConfig = {
    apiKey: "AIzaSyC06oaHGipI9lNfFnCcgLPnOqMKZTPl-wI",
    authDomain: "game-hub-6b4ec.firebaseapp.com",
    projectId: "game-hub-6b4ec",
    storageBucket: "game-hub-6b4ec.firebasestorage.app",
    messagingSenderId: "562667815247",
    appId: "1:562667815247:web:f9ba3d431bc8dc2c7e853a",
    measurementId: "G-VT7F73XYWV"
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

