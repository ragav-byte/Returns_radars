// components/AdminPanel.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import "./AdminPanel.css";

function AdminPanel({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    try {
      const snapshot = await getDocs(collection(db, "returns"));
      const allRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(allRequests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all return requests:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "returns", id));
      setRequests(requests.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const ref = doc(db, "returns", id);
      await updateDoc(ref, { status: newStatus });
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Counts
  const total = requests.length;
  const accepted = requests.filter((r) => r.status === "Accepted").length;
  const rejected = requests.filter((r) => r.status === "Rejected").length;

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.email}</p>
        <button onClick={onLogout}>Logout</button>
      </div>

      <div className="stats">
        <div className="stat accepted">✅ Accepted: {accepted}</div>
        <div className="stat rejected">❌ Rejected: {rejected}</div>
        <div className="stat total">📦 Total: {total}</div>
      </div>

      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <div className="requests-list">
          {requests.map((req) => (
            <div key={req.id} className="request-card">
              <p><strong>User:</strong> {req.userEmail || "Unknown"}</p>
              <p><strong>Order ID:</strong> {req.orderId}</p>
              <p><strong>Product ID:</strong> {req.productId}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
              <p><strong>Status:</strong> {req.status}</p>

              {req.imageUrl && (
                <img src={req.imageUrl} alt="Product" className="preview-img" />
              )}

              <div className="request-actions">
                <button onClick={() => updateStatus(req.id, "Accepted")}>✅ Mark Valid</button>
                <button onClick={() => updateStatus(req.id, "Rejected")}>❌ Mark Invalid</button>
                <button onClick={() => handleDelete(req.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
