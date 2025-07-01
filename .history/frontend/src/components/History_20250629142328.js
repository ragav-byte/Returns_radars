// src/components/History.js
import React, { useEffect, useState } from "react";
import { realtimeDB } from "../firebase/config";
import { ref, onValue } from "firebase/database";
import "./History.css"; // (Optional styling)

function History() {
  const [popupHistory, setPopupHistory] = useState([]);

  useEffect(() => {
    const historyRef = ref(realtimeDB, "popupHistory");

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const historyArray = Object.entries(data).map(([id, item]) => ({
          id,
          ...item,
        }));
        setPopupHistory(historyArray.reverse()); // Show latest first
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="history-container">
      <h2>Popup History</h2>
      {popupHistory.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <ul className="history-list">
          {popupHistory.map((item) => (
            <li key={item.id} className={`history-item ${item.finalDecision?.toLowerCase() === "accept" ? "accepted" : "rejected"}`}>
              <strong>Decision:</strong> {item.finalDecision} <br />
              <strong>Reason Match:</strong> {item.reasonMatched ? "Yes" : "No"} <br />
              <strong>Trust Score:</strong> C: {item.customerTrustScore}, P: {item.productTrustScore}
              <br />
              <strong>Message:</strong> {item.customerMessage}
              <br />
              <small>{new Date(item.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default History;
