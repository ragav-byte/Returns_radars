import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import Sidebar from "./Sidebar";
import ManageUsers from "./pages/ManageUsers";
import ViewReturns from "./pages/ViewReturns";
import "./AdminPanel.css";
import {
  getDecisionClassName,
  getDecisionLabel,
  normalizeDecision,
} from "../utils/returnStatus";

function AdminPanel({ user, onLogout, isSigningOut }) {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [orderData, setOrderData] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    fetch("/order.json")
      .then((res) => res.json())
      .then((data) => setOrderData(data))
      .catch((error) => {
        console.error("Unable to load order data.", error);
        setPageError("We could not load the order catalog.");
      });
  }, []);

  const loadHistory = async () => {
    setLoading(true);

    try {
      const returnsQuery = query(
        collection(db, "popupHistory"),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(returnsQuery);
      const data = snapshot.docs.map((historyDoc) => ({
        id: historyDoc.id,
        ...historyDoc.data(),
      }));
      setHistory(data);
      setPageError("");
    } catch (error) {
      console.error("Error fetching return requests:", error);
      setPageError("We could not load the return request queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const deleteRequest = async (id) => {
    try {
      await deleteDoc(doc(db, "popupHistory", id));
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Unable to delete return request.", error);
      setPageError("We could not delete that request.");
    }
  };

  const updateDecision = async (id, finalDecision) => {
    try {
      await updateDoc(doc(db, "popupHistory", id), { finalDecision });
      setHistory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, finalDecision } : item
        )
      );
    } catch (error) {
      console.error("Unable to update the final decision.", error);
      setPageError("We could not update that decision.");
    }
  };

  const total = history.length;
  const accepted = history.filter(
    (item) => normalizeDecision(item.finalDecision) === "accept"
  ).length;
  const rejected = history.filter(
    (item) => normalizeDecision(item.finalDecision) === "reject"
  ).length;
  const inReview = history.filter(
    (item) => normalizeDecision(item.finalDecision) === "review"
  ).length;

  const renderOverview = () => (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <p className="section-label">Admin overview</p>
          <h1>Returns operations dashboard</h1>
          <p>
            Monitor request volume, keep decisions consistent, and review the
            latest activity across the return queue.
          </p>
        </div>

        <button className="toolbar-button" type="button" onClick={loadHistory}>
          Refresh queue
        </button>
      </div>

      {pageError ? <div className="admin-alert">{pageError}</div> : null}

      <div className="stats-grid">
        <article className="stat-card">
          <span>Total requests</span>
          <strong>{total}</strong>
        </article>
        <article className="stat-card">
          <span>Approved</span>
          <strong>{accepted}</strong>
        </article>
        <article className="stat-card">
          <span>Manual review</span>
          <strong>{inReview}</strong>
        </article>
        <article className="stat-card">
          <span>Rejected</span>
          <strong>{rejected}</strong>
        </article>
      </div>

      <section className="admin-card">
        <div className="admin-card__header">
          <div>
            <p className="section-label">Latest requests</p>
            <h2>Recent activity</h2>
          </div>
        </div>

        {loading ? (
          <p className="admin-empty">Loading requests...</p>
        ) : history.length === 0 ? (
          <p className="admin-empty">No return requests have been submitted yet.</p>
        ) : (
          <div className="request-grid">
            {history.slice(0, 6).map((item) => {
              const product =
                orderData[item.orderId]?.products.find(
                  (candidate) => candidate.productId === item.productId
                ) || {};

              return (
                <article className="request-card" key={item.id}>
                  <div className="request-card__header">
                    <div>
                      <strong>{product.name || item.productId}</strong>
                      <p>{item.userEmail || "Unknown user"}</p>
                    </div>
                    <span
                      className={`status-pill ${getDecisionClassName(
                        item.finalDecision
                      )}`}
                    >
                      {getDecisionLabel(item.finalDecision)}
                    </span>
                  </div>

                  <p className="request-card__reason">{item.reason}</p>

                  <div className="request-card__meta">
                    <span>Order {item.orderId}</span>
                    <span>
                      {item.timestamp?.seconds
                        ? new Date(item.timestamp.seconds * 1000).toLocaleString()
                        : "Waiting for timestamp"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case "users":
        return <ManageUsers />;
      case "returns":
        return (
          <ViewReturns
            history={history}
            loading={loading}
            orderData={orderData}
            onUpdateDecision={updateDecision}
            onDeleteRequest={deleteRequest}
            onRefresh={loadHistory}
            error={pageError}
          />
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="admin-shell">
      <Sidebar
        collapsed={collapsed}
        toggleSidebar={() => setCollapsed((value) => !value)}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        onLogout={onLogout}
        user={user}
        isSigningOut={isSigningOut}
      />
      <div className={`content-area ${collapsed ? "collapsed" : ""}`}>
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPanel;
