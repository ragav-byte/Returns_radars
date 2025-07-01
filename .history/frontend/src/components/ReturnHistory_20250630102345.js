// components/ReturnHistoryPage.js
import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import "./ReturnHistory.css"; // optional for styles

const ReturnHistoryPage = ({ user }) => {
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
        const data = snapshot.docs.map((doc) => doc.data());
        setHistory(data);
      } catch (error) {
        console.error("Error fetching return history:", error);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  return (
    <div className="return-history-page">
       <button onClick={() => navigate("/")}>Back to Dashboard</button>
      <h2>Your Return History</h2>
      {history.length === 0 ? (
        <p>No return history found.</p>
      ) : (
        <ul className="return-list">
          {history.map((item, index) => (
            <li key={index} className={`return-item ${item.result === "Accepted" ? "accepted" : "rejected"}`}>
              <strong>Order ID:</strong> {item.orderId} <br />
              <strong>Reason:</strong> {item.reason} <br />
              <strong>Result:</strong>{" "}
              <span style={{ color: item.result === "Accepted" ? "green" : "red" }}>{item.result}</span> <br />
              <strong>Time:</strong> {new Date(item.timestamp.seconds * 1000).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReturnHistoryPage;
// components/ReturnHistoryPage.js
import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import "./ReturnHistory.css";

const ReturnHistoryPage = ({ user }) => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate(); // ✅ call useNavigate here

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, "popupHistory"),
          where("userEmail", "==", user.email),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => doc.data());
        setHistory(data);
      } catch (error) {
        console.error("Error fetching return history:", error);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  return (
    <div className="return-history-page">
      <button onClick={() => navigate("/")}>Back to Dashboard</button>
      <h2>Your Return History</h2>
      {history.length === 0 ? (
        <p>No return history found.</p>
      ) : (
        <ul className="return-list">
          {history.map((item, index) => (
            <li key={index} className={`return-item ${item.result === "Accepted" ? "accepted" : "rejected"}`}>
              <strong>Order ID:</strong> {item.orderId} <br />
              <strong>Reason:</strong> {item.reason} <br />
              <strong>Result:</strong>{" "}
              <span style={{ color: item.result === "Accepted" ? "green" : "red" }}>{item.result}</span> <br />
              <strong>Time:</strong> {new Date(item.timestamp.seconds * 1000).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReturnHistoryPage;
