import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAwSiKLoyEoXMiUAlTbRAT0P1P4RuVrWps",
  authDomain: "rudraksha-design-studio.firebaseapp.com",
  projectId: "rudraksha-design-studio",
  storageBucket: "rudraksha-design-studio.firebasestorage.app",
  messagingSenderId: "526115046972",
  appId: "1:526115046972:web:6d6ffd2f71e3471494a539",
  measurementId: "G-VCVPPFKZS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
