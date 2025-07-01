import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import "./ReturnHistory.css";

function ReturnHistory({ user }) {
   const [orderId, setOrderId] = useState("");
    const [productId, setProductId] = useState("");
    const [reason, setReason] = useState("");
    const [image, setImage] = useState(null);
    const [popupData, setPopupData] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [productInfo, setProductInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    // Load JSON on mount
   fetch("/order.json")
  .then((res) => res.json())
  .then((data) => {
    console.log("Loaded orders:", data); // ✅ debug check
    setOrderData(data);
  });

  }, []);

useEffect(() => {
  if (orderId && productId && orderData[orderId]) {
    console.log("Checking product for:", orderId, productId);
    const product = orderData[orderId].products.find(
      (p) => p.productId === productId
    );
    console.log("Found product:", product);
    setProductInfo(product || null);
  } else {
    setProductInfo(null);
  }
}, [orderId, productId, orderData]);


  useEffect(() => {
    if (!user || !user.email) return;

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
          {history.map((item) => (
            <div
              key={item.id}
              className={`return-card ${
                item.finalDecision?.toLowerCase() === "accept" ? "accepted" : "rejected"
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
                <div className="img-placeholder" />
                {productInfo && (
                <div className="card-details">
                  <p className="product-title">Product Name {productInfo.name}&nbsp; <b>Model</b></p>}
                  <p className="product-desc">Product Description</p>
                  <p className="return-reason">{item.reason}</p>
                </div>
                <div className="card-meta">
                  <p><b>Date of request:</b><br />
                    {item.timestamp?.seconds &&
                      new Date(item.timestamp.seconds * 1000).toLocaleDateString()}
                  </p>
                  <p><b>Decision:</b><br />{item.finalDecision}</p>
                  <p><b>Rejection Reason:</b><br />{item.rejectionReason || "N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReturnHistory;
