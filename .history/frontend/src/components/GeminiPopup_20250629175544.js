import React, { useEffect } from "react";
import "./GeminiPopup.css";
import { ReactComponent as AcceptIcon } from './accept-pop.svg';
import { ReactComponent as RejectIcon } from './reject-pop.svg';

import { db, serverTimestamp } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

// Store previously saved popup hashes (fallback if popupId missing)
const savedHashes = new Set();

function GeminiPopup({ data, onClose }) {
  const isAccepted = data.finalDecision?.toLowerCase() === "accept";

  useEffect(() => {
    const generateHash = (obj) => {
      return JSON.stringify(obj)
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
        .toString();
    };

    const saveToFirestore = async () => {
      if (!data) return;

      const uniqueId = data.popupId || generateHash(data);

      if (!savedHashes.has(uniqueId)) {
        try {
          await addDoc(collection(db, "popupHistory"), {
            ...data,
            timestamp: serverTimestamp()
          });
          savedHashes.add(uniqueId);
          console.log("Popup saved:", uniqueId);
        } catch (error) {
          console.error("Error saving popup data:", error);
        }
      } else {
        console.log("Skipped duplicate save for popupId:", uniqueId);
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
