import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChWneq6pD22BA0UaPlHyJm2ByWUE_j6Yg",
  authDomain: "progen-9fa96.firebaseapp.com",
  projectId: "progen-9fa96",
  storageBucket: "progen-9fa96.appspot.com",
  messagingSenderId: "772709933820",
  appId: "1:772709933820:web:f0b7cd28a31839ee00ad79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = new getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);