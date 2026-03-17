// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

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
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app;
