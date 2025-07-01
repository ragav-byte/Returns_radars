import React, { useState } from "react";
import { database } from "./firebase"; // adjust path if needed
import { ref, onValue } from "firebase/database";

const History = () => {
  const [returns, setReturns] = useState([]);
  const [show, setShow] = useState(false);

  const fetchReturns = () => {
    const returnsRef = ref(database, "returns"); // assuming you store under /returns
    onValue(returnsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const result = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setReturns(result.reverse()); // latest first
      }
    });
    setShow(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={fetchReturns}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        View Return History
      </button>

      {show && (
        <div style={{ marginTop: "20px" }}>
          <h2>Return History</h2>
          <ul>
            {returns.map((item) => (
              <li key={item.id} style={{ marginBottom: "10px" }}>
                <strong>Order ID:</strong> {item.orderId}<br />
                <strong>Product ID:</strong> {item.productId}<br />
                <strong>Reason:</strong> {item.reason}<br />
                <strong>Status:</strong> {item.status || "Pending"}<br />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default History;
