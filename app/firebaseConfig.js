


// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyASAEMLyjxcS1MvCv_8d6Awzw2rTYM29VI",
  authDomain: "cinemaweb-c41de.firebaseapp.com",
  projectId: "cinemaweb-c41de",
  storageBucket: "cinemaweb-c41de.firebasestorage.app",
  messagingSenderId: "335324964795",
  appId: "1:335324964795:web:d5b79571c77ea0ad7ec69e",
  measurementId: "G-0P3CLM1XZT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  app,
};