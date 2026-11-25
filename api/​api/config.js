module.exports = {
  firebaseConfig: {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBw2srsQ1v5_RjzrPHNseEtzRBjZAJnPMI",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "supercell-583cf.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://supercell-583cf-default-rtdb.firebaseio.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "supercell-583cf",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "supercell-583cf.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "957141044144",
    appId: process.env.FIREBASE_APP_ID || "1:957141044144:web:606bc9c5f97b9853aa2475"
  },
  validSections: ["group", "channel", "page", "market"]
};
