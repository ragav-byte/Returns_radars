import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import "./History.css"; // Optional for styling

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const q = query(collection(db, "history"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(data);
    };

    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <h2>Past Return Analyses</h2>
      {history.map((item, idx) => (
        <div key={idx} className="history-card">
          <p><strong>Observation:</strong> {item.adminObservation}</p>
          <p><strong>Decision:</strong> {item.finalDecision}</p>
          <p><strong>Reason Match:</strong> {item.reasonMatched ? "Yes" : "No"}</p>
          <p><strong>Customer Message:</strong> {item.customerMessage}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default History;
