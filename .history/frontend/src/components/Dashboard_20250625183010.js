import React, { useState } from "react";
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
        <p>Order ID</p>
        <input className="text-input"
          type="text"
          placeholder="Ex. ORD123"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />
        <p>Product ID</p>
        <input className="text-input"
          type="text"
          placeholder="Ex. PROD001"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        />
        <p >Return description</p>
        <textarea className="text-input-desc"
          placeholder="Enter reason for return"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
    <div className="upload-container">
  <span className="file-name">No file chosen</span>
  <label htmlFor="file-upload" className="custom-file-upload">
    📤 Upload Image
  </label>
  <input
    id="file-upload"
    type="file"
    accept="image/*"
    onChange={(e) => {
      const fileName = e.target.files[0]?.name || 'No file chosen';
      document.querySelector('.file-name').textContent = fileName;
    }}
  />
</div>

        <button type="submit">Submit Return</button>
      </form>

      {showPopup && popupData && (
        <GeminiPopup data={popupData} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}

export default Dashboard;
