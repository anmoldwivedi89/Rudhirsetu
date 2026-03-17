// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCILiFnG-8NcmgiboSrmy1s8VA3lL4pMfs",
  authDomain: "rudhirsetu-6fd2b.firebaseapp.com",
  projectId: "rudhirsetu-6fd2b",
  storageBucket: "rudhirsetu-6fd2b.firebasestorage.app",
  messagingSenderId: "6267365116",
  appId: "1:6267365116:web:188941450c208c821c9979",
  measurementId: "G-FN7MJ8SX2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Analytics can throw in some environments (e.g. blocked cookies); keep non-fatal.
try { getAnalytics(app) } catch { /* noop */ }
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
