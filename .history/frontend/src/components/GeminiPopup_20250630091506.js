import React, { useEffect } from "react";
import "./GeminiPopup.css";
import { ReactComponent as AcceptIcon } from './accept-pop.svg';
import { ReactComponent as RejectIcon } from './reject-pop.svg';

import { db, serverTimestamp } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Session-level in-memory store to avoid double saving in same session
const savedPopups = new Set();

function GeminiPopup({ data, onClose }) {
  const isAccepted = data.finalDecision?.toLowerCase() === "accept";

  useEffect(() => {
    const saveToFirestore = async () => {
      if (!data?.popupId) {
        console.warn("❌ No popupId found, skipping Firestore save.");
        return;
      }

      if (savedPopups.has(data.popupId)) {
        console.log("🔁 Already saved this popup in this session:", data.popupId);
        return;
      }

      try {
        const docRef = doc(db, "popupHistory", data.popupId);
        const existingDoc = await getDoc(docRef);

        if (existingDoc.exists()) {
          console.log("🛑 Already exists in Firestore:", data.popupId);
          savedPopups.add(data.popupId); // prevent future retries
          return;
        }

        await setDoc(docRef, {
          ...data,
          timestamp: serverTimestamp(),
        });

        savedPopups.add(data.popupId);
        console.log("✅ Popup saved to Firestore with ID:", data.popupId);
      } catch (error) {
        console.error("🔥 Firestore save error:", error);
      }
    };

    saveToFirestore();
  }, [data]);

  return (
    <div className="popup-container">
      <div className={`popup-content ${isAccepted ? "popup-green" : "popup-red"}`}>
        <span className="close-btn" onClick={onClose}>✖</span>
        {isAccepted ? <AcceptIcon className="popup-icon" /> : <RejectIcon className="popup-icon" />}
        <h2>{isAccepted ? "Return Approved" : "Return Flagged"}</h2>
        <div className="popup-details">
          <p><strong>Observation:</strong> {data.adminObservation}</p>
          <p><strong>Decision:</strong> {data.finalDecision}</p>
          <p><strong>Reason Match:</strong> {data.reasonMatched ? "Yes" : "No"}</p>
          <p><strong>Damage:</strong> {data.damageConfirmation}</p>
          <p><strong>Color Mismatch:</strong> {data.colorMismatch}</p>
          <p><strong>Customer Trust:</strong> {data.customerTrustScore}</p>
          <p><strong>Product Trust:</strong> {data.productTrustScore}</p>
          <p><strong>Delivery:</strong> {data.deliveryCheck}</p>
          <p><strong>Weight:</strong> {data.weightAnalysis}</p>
          <p><strong>Message:</strong> {data.customerMessage}</p>
        </div>
      </div>
    </div>
  );
}

export default GeminiPopup;
