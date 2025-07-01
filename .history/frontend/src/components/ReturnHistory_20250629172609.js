// components/HistoryViewer.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config'; // ✅ import Firestore

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "returns"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHistory(data);
      } catch (error) {
        console.error("Error fetching return history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>📜 Return History</h2>
      {history.length === 0 ? (
        <p>No return requests found.</p>
      ) : (
        <ul>
          {history.map((entry) => (
            <li key={entry.id}>
              <strong>Order ID:</strong> {entry.orderId}, <strong>Reason:</strong> {entry.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
