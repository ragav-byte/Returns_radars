import React, { useState,  useEffect } from "react";
import GeminiPopup from "./GeminiPopup";
import ReturnHistory from "./ReturnHistory";
import "./Dashboard.css";

function Dashboard({ user }) {
  const [orderId, setOrderId] = useState("");
  const [productId, setProductId] = useState("");
  const [reason, setReason] = useState("");
  const [image, setImage] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
const [orderData, setOrderData] = useState({});
const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    // Load JSON on mount
    fetch("/orders.json")
      .then((res) => res.json())
      .then((data) => setOrderData(data));
  }, []);

  useEffect(() => {
    // When orderId or productId changes, try to look up info
    if (orderId && productId && orderData[orderId]) {
      const product = orderData[orderId].products.find(
        (p) => p.productId === productId
      );
      setProductInfo(product || null);
    } else {
      setProductInfo(null);
    }
  }, [orderId, productId, orderData]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Upload product image!");

    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("productId", productId);
    formData.append("returnReason", reason);
    formData.append("productMedia", image);

    try {
      const res = await fetch("http://localhost:5000/generate-return-review", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      setPopupData(data);
      setShowPopup(true);
    } catch (err) {
      alert("Backend error: " + err.message);
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="dash-container">
      <div className="dash-header">
        <h2>Welcome, {user.email}</h2>
        <button className="clock-btn" onClick={() => setShowHistory(!showHistory)}>
          ⏰ View History
        </button>
      </div>

      {showHistory && <ReturnHistory user={user} />}

      <form onSubmit={handleSubmit} className="return-form">
        <p className="inp-plc-hld">Order ID</p>
        <input className="text-input"
          type="text"
          placeholder="Ex. ORD123"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />
        <p className="inp-plc-hld">Product ID</p>
        <input className="text-input"
          type="text"
          placeholder="Ex. PROD001"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        />
        <p className="inp-plc-hld">Return description</p>
        <textarea className="text-input-desc"
          placeholder="Enter reason for return"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
   <input className="text-input"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

{productInfo && (
  <div className="product-info-box">
    <p><strong>Name:</strong> {productInfo.name}</p>
    <p><strong>Specs:</strong> {productInfo.specs}</p>
  </div>
)}




        <button type="submit">Submit Return</button>
      </form>

      {showPopup && popupData && (
        <GeminiPopup data={popupData} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}

export default Dashboard;
