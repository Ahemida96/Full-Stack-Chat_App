import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQSIhgA1ev3tYE5eVVAoyuc_WVUwVEHco",
  authDomain: "progen-9e8e9.firebaseapp.com",
  projectId: "progen-9e8e9",
  storageBucket: "progen-9e8e9.appspot.com",
  messagingSenderId: "243290344596",
  appId: "1:243290344596:web:2416201b008ede665d3881"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = new getAuth(app);
export const provider = new GoogleAuthProvider();