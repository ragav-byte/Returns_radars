// components/ReturnHistory.js
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import "./ReturnHistory.css"; // optional for styles

function ReturnHistory({ user }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, "popupHistory"),
          where("userEmail", "==", user.email),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(data);
      } catch (err) {
        console.error("Error fetching return history:", err);
      }
    };

    fetchHistory();
  }, [user.email]);

  return (
    <div className="history-list">
      <h3>📜 Your Return History</h3>
      {history.length === 0 ? (
        <p>No returns yet!</p>
      ) : (
        <ul>
          {history.map((item) => (
            <li key={item.id} className={`history-item ${item.finalDecision.toLowerCase() === "accept" ? "accept" : "reject"}`}>
              <strong>{item.orderId}</strong> – {item.productId}<br />
              <span>{item.finalDecision}</span> | <small>{new Date(item.timestamp?.seconds * 1000).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReturnHistory;
