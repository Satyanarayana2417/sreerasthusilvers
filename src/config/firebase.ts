import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFXURIC8njn09ahaMDo558Q9Uw5xxmI6M",
  authDomain: "sreerasthusilvers-2d574.firebaseapp.com",
  projectId: "sreerasthusilvers-2d574",
  storageBucket: "sreerasthusilvers-2d574.firebasestorage.app",
  messagingSenderId: "748829519118",
  appId: "1:748829519118:web:7fd09428098720bc6ebb5f",
  measurementId: "G-Q122EBRT4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
