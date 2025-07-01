import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import "./ReturnHistory.css";

function ReturnHistory({ user }) {
  const [orderData, setOrderData] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load order.json
  useEffect(() => {
    fetch("/order.json")
      .then((res) => res.json())
      .then((data) => {
        setOrderData(data);
      });
  }, []);

  // Fetch history from Firestore
  useEffect(() => {
    if (!user?.email) return;

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
  }, [user]);

  return (
    <div className="history-container">
      <h3>📜 Your Return History</h3>

      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No returns yet!</p>
      ) : (
        <div className="card-grid">
          {history.map((item) => {
            const product =
              orderData[item.orderId]?.products.find(
                (p) => p.productId === item.productId
              ) || {};

            return (
              <div
                key={item.id}
                className={`return-card ${
                  item.finalDecision?.toLowerCase() === "accept"
                    ? "accepted"
                    : "rejected"
                }`}
              >
                <div className="card-header">
                  <div>
                    <strong>Order Id:</strong> {item.orderId} &nbsp;&nbsp;
                    <strong>Product Id:</strong> {item.productId}
                  </div>
                  <div
                    className={`status-pill ${
                      item.finalDecision?.toLowerCase() === "accept"
                        ? "pill-accept"
                        : "pill-reject"
                    }`}
                  >
                    Status: {item.finalDecision}
                  </div>
                </div>
                <hr />
                <div className="card-body">
                  {product.url ? (
                    <img
                      src={product.url}
                      alt="Product"
                      className="img-placeholder"
                    />
                  ) : (
                    <div className="img-placeholder" />
                  )}

                  <div className="card-details">
                    <p className="product-title">
                      {product.name} <b>{product.specs}</b>
                    </p>
                    {/*<p className="product-desc">{product.description || "No description available."}</p>*/}
                    <p className="return-reason">Reason for return: {item.reason}</p>
                  </div>

                  <div className="card-meta">
                    <small>
                {item.timestamp?.seconds &&
                  new Date(item.timestamp.seconds * 1000).toLocaleString()}
              </small>
                    <p>
                      <b>Decision:</b>
                      <br />
                      {item.finalDecision}
                    </p>
                    <p>
                      <b>Rejection Reason:</b>
                      <br />
                      {item.rejectionReason || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ReturnHistory;
