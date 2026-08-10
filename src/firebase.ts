// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9Po0SIP54I9Ndd__v5-CZUarqgKK8c_4",
  authDomain: "aanadshala-website.firebaseapp.com",
  projectId: "aanadshala-website",
  storageBucket: "aanadshala-website.firebasestorage.app",
  messagingSenderId: "331013694735",
  appId: "1:331013694735:web:d603f6e89aa66418740a7a",
  measurementId: "G-Y48LXNV8DG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (err) {
        // Suppress analytics error when blocked by client/adblocker
      }
    }
  }).catch(() => {});
}

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};

export default app;
