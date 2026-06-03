// Copy to firebase-config.js (or firebase-config.local.js) with your Firebase web app keys.
// Client API keys are public by design — restrict domains in Firebase Console → Authentication → Settings.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

window.gameHubConfig = firebaseConfig;
