import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import "./ReturnHistory.css";
import {
  getDecisionClassName,
  getDecisionLabel,
} from "../utils/returnStatus";

function ReturnHistory({ user, onClose }) {
  const [orderData, setOrderData] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/order.json")
      .then((res) => res.json())
      .then((data) => {
        setOrderData(data);
      });
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    const fetchHistory = async () => {
      try {
        const historyQuery = query(
          collection(db, "popupHistory"),
          where("userEmail", "==", user.email),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(historyQuery);
        const data = snapshot.docs.map((historyDoc) => ({
          id: historyDoc.id,
          ...historyDoc.data(),
        }));
        setHistory(data);
      } catch (error) {
        console.error("Error fetching return history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <div className="history-overlay">
      <div className="history-container-2">
        <div className="history-header">
          <div>
            <p className="section-label">Saved requests</p>
            <h3>Your return history</h3>
          </div>
          <button className="history-close" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        {loading ? (
          <p className="history-empty">Loading your request history...</p>
        ) : history.length === 0 ? (
          <p className="history-empty">You have not submitted any returns yet.</p>
        ) : (
          <div className="history-list">
            {history.map((item) => {
              const product =
                orderData[item.orderId]?.products.find(
                  (productItem) => productItem.productId === item.productId
                ) || {};

              return (
                <article className="history-card" key={item.id}>
                  <div className="history-card__header">
                    <div>
                      <strong>{product.name || item.productId}</strong>
                      <p>
                        Order {item.orderId} | Product {item.productId}
                      </p>
                    </div>
                    <span
                      className={`status-pill ${getDecisionClassName(
                        item.finalDecision
                      )}`}
                    >
                      {getDecisionLabel(item.finalDecision)}
                    </span>
                  </div>

                  <div className="history-card__body">
                    <div className="history-card__image">
                      {product.url ? <img src={product.url} alt={product.name} /> : null}
                    </div>

                    <div className="history-card__copy">
                      <p>
                        <strong>Specs:</strong> {product.specs || "Not available"}
                      </p>
                      <p>
                        <strong>Reason:</strong> {item.reason}
                      </p>
                      <p>
                        <strong>Decision note:</strong>{" "}
                        {item.customerMessage || "No message was generated."}
                      </p>
                      <p>
                        <strong>Requested on:</strong>{" "}
                        {item.timestamp?.seconds
                          ? new Date(item.timestamp.seconds * 1000).toLocaleString()
                          : "Waiting for timestamp"}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReturnHistory;
