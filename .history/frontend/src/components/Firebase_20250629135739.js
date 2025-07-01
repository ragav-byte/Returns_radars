// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCeB2jMvDdUHUTANY8iFS9hsTug-2JGjrU",
  authDomain: "returnsradar.firebaseapp.com",
  projectId: "returnsradar",
  storageBucket: "returnsradar.appspot.com", // corrected `.app` to `.appspot.com`
  messagingSenderId: "29621255516",
  appId: "1:29621255516:web:de4b66341c26bb01379599"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore DB
export const db = getFirestore(app);
