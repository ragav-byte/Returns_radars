import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import "../AdminPanel.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    setLoading(true);

    try {
      const usersQuery = query(collection(db, "users"), orderBy("email", "asc"));
      const snapshot = await getDocs(usersQuery);
      const data = snapshot.docs.map((userDoc) => ({
        id: userDoc.id,
        ...userDoc.data(),
      }));
      setUsers(data);
      setError("");
    } catch (loadError) {
      console.error("Unable to load users.", loadError);
      setError("We could not load users from Firestore.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const visibleUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) =>
      `${user.email || ""} ${user.role || ""} ${user.id}`
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [search, users]);

  const adminCount = users.filter((user) => user.role === "admin").length;

  const toggleRole = async (user) => {
    const nextRole = user.role === "admin" ? "user" : "admin";
    setSavingUserId(user.id);

    try {
      await updateDoc(doc(db, "users", user.id), { role: nextRole });
      setUsers((previous) =>
        previous.map((entry) =>
          entry.id === user.id ? { ...entry, role: nextRole } : entry
        )
      );
    } catch (saveError) {
      console.error("Unable to update user role.", saveError);
      setError("We could not update that user role.");
    } finally {
      setSavingUserId("");
    }
  };

  return (
    <div className="manage-users-page">
      <div className="page-header">
        <div>
          <p className="section-label">User access</p>
          <h1>Manage users</h1>
          <p>
            Review registered accounts, confirm access levels, and promote or
            demote admins without leaving the dashboard.
          </p>
        </div>
        <button className="toolbar-button" type="button" onClick={loadUsers}>
          Refresh users
        </button>
      </div>

      {error ? <div className="admin-alert">{error}</div> : null}

      <div className="stats-grid">
        <article className="stat-card">
          <span>Total users</span>
          <strong>{users.length}</strong>
        </article>
        <article className="stat-card">
          <span>Administrators</span>
          <strong>{adminCount}</strong>
        </article>
        <article className="stat-card">
          <span>Customers</span>
          <strong>{users.length - adminCount}</strong>
        </article>
        <article className="stat-card">
          <span>Visible results</span>
          <strong>{visibleUsers.length}</strong>
        </article>
      </div>

      <div className="search-row">
        <input
          className="search-input"
          type="search"
          placeholder="Search by email, role, or user id"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-card">
          <p className="admin-empty">Loading users...</p>
        </div>
      ) : visibleUsers.length === 0 ? (
        <div className="admin-card">
          <p className="admin-empty">No users matched that search.</p>
        </div>
      ) : (
        <div className="users-grid">
          {visibleUsers.map((user) => (
            <article className="user-card" key={user.id}>
              <div className="user-card__header">
                <div>
                  <h3>{user.email || "Unknown email"}</h3>
                  <p>{user.id}</p>
                </div>
                <span
                  className={`status-pill ${
                    user.role === "admin" ? "decision-accept" : "decision-pending"
                  }`}
                >
                  {user.role === "admin" ? "Admin" : "User"}
                </span>
              </div>

              <div className="user-card__meta">
                <p>
                  <strong>Access:</strong>{" "}
                  {user.role === "admin"
                    ? "Full admin dashboard access"
                    : "Customer return submission access"}
                </p>
              </div>

              <button
                className="action-button"
                type="button"
                onClick={() => toggleRole(user)}
                disabled={savingUserId === user.id}
              >
                {savingUserId === user.id
                  ? "Updating..."
                  : user.role === "admin"
                  ? "Demote to user"
                  : "Promote to admin"}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
