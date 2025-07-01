// components/HistoryViewer.js
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { realtimeDB } from './firebase';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const historyRef = ref(realtimeDB, 'returns'); // path depends on how you're saving it
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.entries(data).map(([key, val]) => ({
          id: key,
          ...val,
        }));
        setHistory(parsed);
      } else {
        setHistory([]);
      }
    });
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
