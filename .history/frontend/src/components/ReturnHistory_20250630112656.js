import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import "./ReturnHistory.css";

function ReturnHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = { email: "testuser@gmail.com" }; // Replace this with real user later

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, "popupHistory"),
          where("userEmail", "==", user.email),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(data);
      } catch (err) {
        console.error("Error fetching return history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <button
        className="close-btn"
        onClick={() => navigate("/dashboard")}
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        ❌ Close
      </button>

      <div className="history-list">
        <h3>📜 Your Return History</h3>
        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p>No returns yet!</p>
        ) : (
          <ul>
            {history.map((item) => (
              <li
                key={item.id}
                className={`history-item ${
                  item.finalDecision?.toLowerCase() === "accept" ? "accept" : "reject"
                }`}
              >
                <strong>{item.orderId}</strong> – {item.productId}
                <br />
                <span>{item.finalDecision}</span> |{" "}
                <small>
                  {item.timestamp?.seconds &&
                    new Date(item.timestamp.seconds * 1000).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ReturnHistory;
