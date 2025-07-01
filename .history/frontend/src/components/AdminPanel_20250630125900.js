import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import "./AdminPanel.css"; // Optional styling

function AdminPanel({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
  });

  // Fetch all return requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "returns"));
        const allRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(allRequests);
        setStats({
          total: allRequests.length,
          accepted: allRequests.filter((r) => r.status === "Accepted").length,
          rejected: allRequests.filter((r) => r.status === "Rejected").length,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  // Admin: delete a request
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "returns", id));
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  // Admin: manually update request status
  const updateStatus = async (id, status) => {
    try {
      const requestRef = doc(db, "returns", id);
      await updateDoc(requestRef, { status });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard - {user.email}</h1>
      <button onClick={onLogout}>Logout</button>

      <div className="stats">
        <h3>Total Requests: {stats.total}</h3>
        <h3>✅ Accepted: {stats.accepted}</h3>
        <h3>❌ Rejected: {stats.rejected}</h3>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="request-list">
          {requests.map((req) => (
            <div key={req.id} className="request-card">
              <p><strong>User:</strong> {req.userEmail}</p>
              <p><strong>Order ID:</strong> {req.orderId}</p>
              <p><strong>Product ID:</strong> {req.productId}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
              <p><strong>Status:</strong> {req.status || "Pending"}</p>

              {req.imageUrl && (
                <img src={req.imageUrl} alt="Return Evidence" height="100" />
              )}

              <div className="actions">
                <button onClick={() => updateStatus(req.id, "Accepted")}>Mark as Accepted</button>
                <button onClick={() => updateStatus(req.id, "Rejected")}>Mark as Rejected</button>
                <button onClick={() => handleDelete(req.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
