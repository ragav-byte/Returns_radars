import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCeB2jMvDdUHUTANY8iFS9hsTug-2JGjrU",
  authDomain: "returnsradar.firebaseapp.com",
  projectId: "returnsradar",
  storageBucket: "returnsradar.appspot.com",
  messagingSenderId: "29621255516",
  appId: "1:29621255516:web:de4b66341c26bb01379599"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app); // still export Firestore if used elsewhere
const realtimeDB = getDatabase(app); // 🔥 new addition

export { db, realtimeDB };
