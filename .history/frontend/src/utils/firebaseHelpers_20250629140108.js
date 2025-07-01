// src/utils/firebaseHelpers.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase/firebase";

export const savePopupToHistory = async (data, userId = "guest") => {
  try {
    await addDoc(collection(db, "history"), {
      ...data,
      userId,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("❌ Error saving history:", error);
  }
};
