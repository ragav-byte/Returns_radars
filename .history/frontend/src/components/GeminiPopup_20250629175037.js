import React, { useEffect } from "react";
import "./GeminiPopup.css";
import { ReactComponent as AcceptIcon } from './accept-pop.svg';
import { ReactComponent as RejectIcon } from './reject-pop.svg';

import { db, serverTimestamp } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";

// A map to persist saved popup state per session (in-memory)
const savedPopups = new Set();

function GeminiPopup({ data, onClose }) {
  const isAccepted = data?.finalDecision?.toLowerCase() === "accept";

  useEffect(() => {
    const saveToFirestore = async () => {
      // Ensure data and popupId exist
      if (!data?.popupId) {
        console.warn("popupId is missing. Skipping save.");
        return;
      }

      // Skip if already saved
      if (savedPopups.has(data.popupId)) {
        console.log("Skipped duplicate save for popupId:", data.popupId);
        return;
      }

      try {
        await setDoc(doc(db, "popupHistory", data.popupId), {
          ...data,
          timestamp: serverTimestamp(),
        });
        savedPopups.add(data.popupId);
        console.log("✅ Popup saved to Firestore:", data.popupId);
      } catch (error) {
        console.error("❌ Error saving popup data:", error);
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
          <p><strong>Observation:</strong> {data?.adminObservation}</p>
          <p><strong>Decision:</strong> {data?.finalDecision}</p>
          <p><strong>Reason Match:</strong> {data?.reasonMatched ? "Yes" : "No"}</p>
          <p><strong>Damage:</strong> {data?.damageConfirmation}</p>
          <p><strong>Color Mismatch:</strong> {data?.colorMismatch}</p>
          <p><strong>Customer Trust:</strong> {data?.customerTrustScore}</p>
          <p><strong>Product Trust:</strong> {data?.productTrustScore}</p>
          <p><strong>Delivery:</strong> {data?.deliveryCheck}</p>
          <p><strong>Weight:</strong> {data?.weightAnalysis}</p>
          <p><strong>Message:</strong> {data?.customerMessage}</p>
        </div>
      </div>
    </div>
  );
}

export default GeminiPopup;
