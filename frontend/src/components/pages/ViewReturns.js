import React, { useMemo, useState } from "react";
import "../AdminPanel.css";
import {
  getDecisionClassName,
  getDecisionLabel,
  normalizeDecision,
} from "../../utils/returnStatus";

function ViewReturns({
  history,
  loading,
  orderData,
  onUpdateDecision,
  onDeleteRequest,
  onRefresh,
  error,
}) {
  const [filter, setFilter] = useState("all");

  const filteredHistory = useMemo(() => {
    if (filter === "all") {
      return history;
    }

    return history.filter(
      (item) => normalizeDecision(item.finalDecision) === filter
    );
  }, [filter, history]);

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "accept", label: "Approved" },
    { key: "review", label: "Manual review" },
    { key: "reject", label: "Rejected" },
  ];

  return (
    <div className="view-returns-page">
      <div className="page-header">
        <div>
          <p className="section-label">Return queue</p>
          <h1>Detailed request review</h1>
          <p>
            Inspect each request, compare the AI result with the supporting
            details, and set the final outcome for the record.
          </p>
        </div>
        <button className="toolbar-button" type="button" onClick={onRefresh}>
          Refresh queue
        </button>
      </div>

      {error ? <div className="admin-alert">{error}</div> : null}

      <div className="toolbar-row">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            className={`filter-chip ${filter === option.key ? "active" : ""}`}
            type="button"
            onClick={() => setFilter(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-card">
          <p className="admin-empty">Loading requests...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="admin-card">
          <p className="admin-empty">No requests match the current filter.</p>
        </div>
      ) : (
        <div className="request-list">
          {filteredHistory.map((item) => {
            const product =
              orderData[item.orderId]?.products.find(
                (candidate) => candidate.productId === item.productId
              ) || {};

            return (
              <article className="request-list-card" key={item.id}>
                <div className="request-list-card__header">
                  <div>
                    <strong>{item.userEmail || "Unknown user"}</strong>
                    <p>
                      Order {item.orderId} | Product {item.productId}
                    </p>
                  </div>
                  <span
                    className={`status-pill ${getDecisionClassName(
                      item.finalDecision
                    )}`}
                  >
                    {getDecisionLabel(item.finalDecision)}
                  </span>
                </div>

                <div className="request-list-card__body">
                  <div className="request-list-card__image">
                    {product.url ? (
                      <img src={product.url} alt={product.name || item.productId} />
                    ) : null}
                  </div>

                  <div className="request-list-card__copy">
                    <h3>{product.name || "Unknown product"}</h3>
                    <p>{product.specs || "No catalog specs available."}</p>
                    <p>
                      <strong>Reason:</strong> {item.reason}
                    </p>
                    <p>
                      <strong>Observation:</strong>{" "}
                      {item.adminObservation || "No AI observation returned."}
                    </p>
                    <p>
                      <strong>Customer message:</strong>{" "}
                      {item.customerMessage || "No customer message available."}
                    </p>
                    <div className="request-list-card__meta">
                      <span>
                        Requested{" "}
                        {item.timestamp?.seconds
                          ? new Date(item.timestamp.seconds * 1000).toLocaleString()
                          : "Waiting for timestamp"}
                      </span>
                    </div>
                  </div>

                  <div className="request-list-card__actions">
                    <button
                      className="action-button"
                      type="button"
                      onClick={() => onUpdateDecision(item.id, "Accept")}
                    >
                      Approve
                    </button>
                    <button
                      className="action-button"
                      type="button"
                      onClick={() => onUpdateDecision(item.id, "Manual Verification")}
                    >
                      Manual review
                    </button>
                    <button
                      className="action-button"
                      type="button"
                      onClick={() => onUpdateDecision(item.id, "Reject")}
                    >
                      Reject
                    </button>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => onDeleteRequest(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ViewReturns;
