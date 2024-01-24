import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

/// gmail | progen
// Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyChWneq6pD22BA0UaPlHyJm2ByWUE_j6Yg",
//   authDomain: "progen-9fa96.firebaseapp.com",
//   projectId: "progen-9fa96",
//   storageBucket: "progen-9fa96.appspot.com",
//   messagingSenderId: "772709933820",
//   appId: "1:772709933820:web:f0b7cd28a31839ee00ad79"
// };

// gmail | chatapp
// const firebaseConfig = {
//   apiKey: "AIzaSyDLl5uN9C6YyLmmE3bu5JEn98PTebYQCtU",
//   authDomain: "chatapp-f7523.firebaseapp.com",
//   projectId: "chatapp-f7523",
//   storageBucket: "chatapp-f7523.appspot.com",
//   messagingSenderId: "394662213406",
//   appId: "1:394662213406:web:20c4d1334fb678028d7b0f"
// };

// pua | chatapp
const firebaseConfig = {
  apiKey: "AIzaSyDXy9lv9X904fqH1hgzy-K1Hw9qcHMjX0g",
  authDomain: "chatapp-3ce01.firebaseapp.com",
  projectId: "chatapp-3ce01",
  storageBucket: "chatapp-3ce01.appspot.com",
  messagingSenderId: "645420705950",
  appId: "1:645420705950:web:9f9a44de5365a8e29b738f"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = new getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);