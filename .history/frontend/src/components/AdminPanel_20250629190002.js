// components/AdminPanel.js
import React from "react";

function AdminPanel({ user, onLogout }) {
  return (
    <div>
      <h1>Welcome Admin {user.email}</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default AdminPanel;
