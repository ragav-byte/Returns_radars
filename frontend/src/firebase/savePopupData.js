// firebase/savePopupData.js
import { collection, addDoc } from "firebase/firestore";
import { db, serverTimestamp } from "../config";

const savePopupData = async (popupData) => {
  try {
    const docRef = await addDoc(collection(db, "popups"), {
      ...popupData,
      createdAt: serverTimestamp()
    });
    console.log("✅ Popup saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("🔥 Error saving popup:", error);
    throw error; // rethrow so you can catch it in your UI
  }
};

export default savePopupData;
