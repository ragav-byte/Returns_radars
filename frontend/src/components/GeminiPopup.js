import React, { useEffect } from "react";
import "./GeminiPopup.css";
import { ReactComponent as AcceptIcon } from "./accept-pop.svg";
import { ReactComponent as RejectIcon } from "./reject-pop.svg";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, serverTimestamp } from "../firebase/config";
import {
  getDecisionClassName,
  getDecisionLabel,
  normalizeDecision,
} from "../utils/returnStatus";

const savedPopups = new Set();

function GeminiPopup({ data, onClose }) {
  const decisionTone = normalizeDecision(data.finalDecision);
  const title =
    decisionTone === "accept"
      ? "Return approved"
      : decisionTone === "review"
      ? "Manual review recommended"
      : "Return rejected";

  useEffect(() => {
    const saveToFirestore = async () => {
      if (!data?.popupId) {
        console.warn("No popupId found, skipping Firestore save.");
        return;
      }

      if (savedPopups.has(data.popupId)) {
        return;
      }

      try {
        const docRef = doc(db, "popupHistory", data.popupId);
        const existingDoc = await getDoc(docRef);

        if (existingDoc.exists()) {
          savedPopups.add(data.popupId);
          return;
        }

        await setDoc(docRef, {
          ...data,
          timestamp: serverTimestamp(),
        });

        savedPopups.add(data.popupId);
      } catch (error) {
        console.error("Firestore save error:", error);
      }
    };

    saveToFirestore();
  }, [data]);

  return (
    <div className="popup-container">
      <div className={`popup-content ${getDecisionClassName(data.finalDecision)}`}>
        <button className="close-btn" type="button" onClick={onClose}>
          x
        </button>
        {decisionTone === "accept" ? (
          <AcceptIcon className="popup-icon" />
        ) : (
          <RejectIcon className="popup-icon" />
        )}
        <h2>{title}</h2>
        <p className="popup-subtitle">
          Final status: {getDecisionLabel(data.finalDecision)}
        </p>
        <div className="popup-details">
          <p>
            <strong>Observation:</strong> {data.adminObservation}
          </p>
          <p>
            <strong>Decision:</strong> {data.finalDecision}
          </p>
          <p>
            <strong>Reason match:</strong> {data.reasonMatched ? "Yes" : "No"}
          </p>
          <p>
            <strong>Damage:</strong> {data.damageConfirmation}
          </p>
          <p>
            <strong>Color mismatch:</strong> {data.colorMismatch}
          </p>
          <p>
            <strong>Customer trust:</strong> {data.customerTrustScore}
          </p>
          <p>
            <strong>Product trust:</strong> {data.productTrustScore}
          </p>
          <p>
            <strong>Delivery:</strong> {data.deliveryCheck}
          </p>
          <p>
            <strong>Weight:</strong> {data.weightAnalysis}
          </p>
          <p>
            <strong>Customer message:</strong> {data.customerMessage}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GeminiPopup;
