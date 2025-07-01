import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore"; // ✅ Firestore only

const firebaseConfig = {
  apiKey: "AIzaSyCeB2jMvDdUHUTANY8iFS9hsTug-2JGjrU",
  authDomain: "returnsradar.firebaseapp.com",
  projectId: "returnsradar",
  storageBucket: "returnsradar.appspot.com",
  messagingSenderId: "29621255516",
  appId: "1:29621255516:web:de4b66341c26bb01379599"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, serverTimestamp };
