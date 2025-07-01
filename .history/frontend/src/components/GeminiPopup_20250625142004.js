import React from "react";
import "./GeminiPopup.css";

function GeminiPopup({ data, onClose }) {
  const isAccepted = data.finalDecision?.toLowerCase() === "accept";

  return (
    <div className={`popup-container ${isAccepted ? "popup-green" : "popup-red"}`}>
      <div className="popup-content">
        <span className="close-btn" onClick={onClose}>✖</span>
        <div className="popup-icon">
          {isAccepted ? "✅" : "❌"}
        </div>
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
