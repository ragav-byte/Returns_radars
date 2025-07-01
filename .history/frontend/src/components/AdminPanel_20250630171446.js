import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import "./AdminPanel.css";

function AdminPanel({ onLogout }) {
  const [orderData, setOrderData] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load order.json once
  useEffect(() => {
    fetch("/order.json")
      .then((res) => res.json())
      .then((data) => {
        setOrderData(data);
      });
  }, []);

  // Load all return history from Firestore
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(collection(db, "popupHistory"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(data);
      } catch (err) {
        console.error("Error fetching all return requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const deleteRequest = async (id) => {
    await deleteDoc(doc(db, "popupHistory", id));
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const updateDecision = async (id, finalDecision) => {
    await updateDoc(doc(db, "popupHistory", id), { finalDecision });
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, finalDecision } : item))
    );
  };

  // Count summary
  const total = history.length;
  const accepted = history.filter((i) => i.finalDecision?.toLowerCase() === "accept").length;
  const rejected = history.filter((i) => i.finalDecision?.toLowerCase() === "reject").length;

  return (
    <div className="history-container">
            <div className="nav-bar">
        <Walmart className="logo"/>
        <div className="user-box">
          <div className="user-logo"></div>
          <h2>Welcome, {user.email}</h2>
        </div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>

   {showHistory && <ReturnHistory user={user} onClose={() => setShowHistory(false)} />}
      </div>
      <h2>📦 All Return Requests (Admin View)</h2>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
      <div className="stats-bar">
        <span>Total: {total}</span>
        <span>✅ Accepted: {accepted}</span>
        <span>❌ Rejected: {rejected}</span>
      </div>

      {loading ? (
        <p>Loading requests...</p>
      ) : history.length === 0 ? (
        <p>No return requests found.</p>
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
                  item.finalDecision?.toLowerCase() === "accept" ? "accepted" : "rejected"
                }`}
              >
                <div className="card-header">
                  <div>
                    <strong>User:</strong> {item.userEmail || "Unknown"}<br />
                    <strong>Order ID:</strong> {item.orderId}<br />
                    <strong>Product ID:</strong> {item.productId}
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
                    <img src={product.url} alt="Product" className="img-placeholder" />
                  ) : (
                    <div className="img-placeholder" />
                  )}

                  <div className="card-details">
                    <p className="product-title">
                      {product.name} <b>{product.specs}</b>
                    </p>
                    <p className="return-reason">Reason: {item.reason}</p>
                    <p className="return-reason">Observation: {item.adminObservation}</p>
                  </div>

                  <div className="card-meta">
                    <p>
                      <b>Requested On:</b><br />
                      {item.timestamp?.seconds &&
                        new Date(item.timestamp.seconds * 1000).toLocaleString()}
                    </p>
                    <p><b>Customer Message:</b><br />{item.customerMessage || "N/A"}</p>
                  </div>

                  <div className="admin-actions">
                    <button onClick={() => updateDecision(item.id, "Accept")}>✅ Mark Accept</button>
                    <button onClick={() => updateDecision(item.id, "Reject")}>❌ Mark Reject</button>
                    <button onClick={() => deleteRequest(item.id)}>🗑️ Delete</button>
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

export default  AdminPanel;
