import React, { useState,  useEffect } from "react";
import GeminiPopup from "./GeminiPopup";
import ReturnHistory from "./ReturnHistory";
import "./Dashboard.css";
import { ReactComponent as Shape } from './steps-new.svg';
import { ReactComponent as Walmart } from './walmart icon.svg';
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

const steps = [
    "Enter your Order ID and Product ID.",
    "Describe the reason for your return.",
    "Upload a clear image of the product.",
    "Click 'Submit Return Request'.",
    "Wait for the AI to analyze your return.",
    "You'll see a ✅ or ❌ popup result.",
  ];


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
    <div className="body-main">
      <div className="nav-bar">
        <Walmart className="logo"/>
        <div className="user-box">
          <div className="user-logo"></div>
          <p>Welcome, {user.email}</p>

          
        </div>
      </div>
    <div className="dash-body">    
    <div className="dash-container">
      {/*<div className="dash-header">
        <h2>Welcome, {user.email}</h2>
        <button className="clock-btn" onClick={() => setShowHistory(!showHistory)}>
          ⏰ View History
        </button>
      </div>*/}
<h2 className="dash-heading">Product return form</h2>
<div>
<button
        onClick={() => setShowHistory(!showHistory)}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          backgroundColor: "#0a66c2",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {showHistory ? "⬅️ Back to Dashboard" : "📜 View Popup History"}
      </button>

      {showHistory ? (
        <History />
      ) : (
        <p style={{ marginTop: 20 }}>
          This is your main dashboard content here. You can show stats, charts,
          whatever you want.
        </p>
      )}
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
        <p className="inp-plc-hld">Product image</p>
        <input className="text-input"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Submit Return</button>
      </form>

      {showPopup && popupData && (
        <GeminiPopup data={popupData} onClose={() => setShowPopup(false)} />
      )}

    </div>

    <div className="flex-2">
    {productInfo && (
  <div className="product-info-box">
      <h2 className="dash-heading">Product details</h2>
    <div className="prod-box">
        <p className="prod-name-text">{productInfo.name}</p>
        <p className="prod-name-specs">{productInfo.specs}</p>
        <div className="prod-img-box">
          <img className="prod-name-img" src={productInfo.url}></img>
        </div>
    </div>
  </div>
)}

 <div className="steps-container">
      <h2 className="dash-heading">How to Submit a Return</h2>
       <Shape className="background-shape" />
      <ul className="steps-list">
        {steps.map((step, index) => (
          <li key={index} className="steps-listItem">
            {step}
          </li>
        ))}
      </ul>
    </div>

    </div>
  </div>
  </div>
  );
}

export default Dashboard;
