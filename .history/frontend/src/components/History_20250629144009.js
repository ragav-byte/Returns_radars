import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase'; // adjust to match your file structure

const History = () => {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    const returnsRef = ref(database, 'returns');

    const unsubscribe = onValue(returnsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const returnList = Object.entries(data).map(([id, value]) => ({ id, ...value }));
        setReturns(returnList);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Return History</h2>
      {returns.length === 0 ? (
        <p>No return history available.</p>
      ) : (
        <ul>
          {returns.map((r) => (
            <li key={r.id}>
              <strong>Order:</strong> {r.orderId}<br />
              <strong>Product:</strong> {r.productId}<br />
              <strong>Reason:</strong> {r.reason}<br />
              <strong>Status:</strong> {r.status || 'Pending'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
