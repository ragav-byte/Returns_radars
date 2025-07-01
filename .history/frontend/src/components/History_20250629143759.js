// components/History.js
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase'; // adjust path as needed

const History = () => {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    const returnsRef = ref(database, 'returns');
    const unsubscribe = onValue(returnsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const returnList = Object.entries(data).map(([id, item]) => ({ id, ...item }));
        setReturns(returnList);
      } else {
        setReturns([]);
      }
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Return History</h2>
      {returns.length === 0 ? (
        <p>No returns yet.</p>
      ) : (
        <ul>
          {returns.map((item) => (
            <li key={item.id}>
              <strong>Order ID:</strong> {item.orderId}<br />
              <strong>Product ID:</strong> {item.productId}<br />
              <strong>Reason:</strong> {item.reason}<br />
              <strong>Status:</strong> {item.status}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
