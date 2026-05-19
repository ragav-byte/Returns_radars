import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import GeminiPopup from "./GeminiPopup";
import ReturnHistory from "./ReturnHistory";
import "./Dashboard.css";
import { ReactComponent as Walmart } from "./walmart icon.svg";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Dashboard({ user, onLogout, isSigningOut }) {
  const [orderId, setOrderId] = useState("");
  const [productId, setProductId] = useState("");
  const [reason, setReason] = useState("");
  const [image, setImage] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [productInfo, setProductInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const steps = [
    "Enter your Order ID and Product ID.",
    "Describe the return issue clearly and honestly.",
    "Upload a clear image of the product.",
    "Submit the request for AI review.",
    "Wait for the AI to analyze your return.",
    "Review the decision and save the result to history.",
  ];

  const trimmedOrderId = useMemo(() => orderId.trim().toUpperCase(), [orderId]);
  const trimmedProductId = useMemo(
    () => productId.trim().toUpperCase(),
    [productId]
  );
  const canSubmit =
    trimmedOrderId && trimmedProductId && reason.trim() && image && !isSubmitting;

  useEffect(() => {
    fetch("/order.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load order data.");
        }

        return response.json();
      })
      .then((data) => {
        setOrderData(data);
        setLookupError("");
      })
      .catch((error) => {
        console.error("Unable to load order data.", error);
        setLookupError("We could not load the local order catalog.");
      });
  }, []);

  useEffect(() => {
    if (!trimmedOrderId || !trimmedProductId) {
      setProductInfo(null);
      return;
    }

    const matchingOrder = orderData[trimmedOrderId];

    if (!matchingOrder) {
      setProductInfo(null);
      return;
    }

    const matchingProduct = matchingOrder.products.find(
      (product) => product.productId.toUpperCase() === trimmedProductId
    );

    setProductInfo(matchingProduct || null);
  }, [orderData, trimmedOrderId, trimmedProductId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!image) {
      setSubmitError("Please upload a product image before submitting.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("orderId", trimmedOrderId);
    formData.append("productId", trimmedProductId);
    formData.append("returnReason", reason.trim());
    formData.append("productMedia", image);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-return-review`, {
        method: "POST",
        body: formData,
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.error || "Unable to submit the return request.");
      }

      const enrichedData = {
        ...responseBody,
        popupId: uuidv4(),
        userEmail: user.email,
        orderId: trimmedOrderId,
        productId: trimmedProductId,
        reason: reason.trim(),
      };

      setPopupData(enrichedData);
      setShowPopup(true);
    } catch (error) {
      console.error("Return submission failed.", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-topbar">
        <div className="brand-lockup">
          <Walmart className="brand-logo" />
          <div>
            <p className="brand-label">ReturnsRadar</p>
            <h1>Customer return desk</h1>
          </div>
        </div>

        <div className="dashboard-topbar__actions">
          <div className="signed-in-pill">
            <span className="signed-in-pill__avatar">
              {user.email?.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{user.email}</strong>
              <span>Signed in customer</span>
            </div>
          </div>

          <button
            className="secondary-button"
            type="button"
            onClick={() => setShowHistory((visible) => !visible)}
          >
            {showHistory ? "Hide history" : "View history"}
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={onLogout}
            disabled={isSigningOut}
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-hero panel">
          <div>
            <p className="section-label">Welcome back</p>
            <h2>Submit cleaner requests and review decisions faster.</h2>
            <p>
              Use the form to send a return request through AI review. Matching
              product details will appear automatically when the order and
              product IDs line up.
            </p>
          </div>
          <div className="hero-stat">
            <span>Ready to review</span>
            <strong>{productInfo ? "Product matched" : "Awaiting lookup"}</strong>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="panel return-panel">
            <div className="panel-header">
              <div>
                <p className="section-label">Return request</p>
                <h3>Submit a product return</h3>
              </div>
              <span className="panel-chip">AI review</span>
            </div>

            <form onSubmit={handleSubmit} className="return-form">
              <label className="field-block">
                <span>Order ID</span>
                <input
                  className="text-input"
                  type="text"
                  placeholder="ORD123"
                  value={orderId}
                  onChange={(event) => setOrderId(event.target.value.toUpperCase())}
                  required
                />
              </label>

              <label className="field-block">
                <span>Product ID</span>
                <input
                  className="text-input"
                  type="text"
                  placeholder="PROD001"
                  value={productId}
                  onChange={(event) =>
                    setProductId(event.target.value.toUpperCase())
                  }
                  required
                />
              </label>

              <label className="field-block">
                <span>Return description</span>
                <textarea
                  className="text-input text-area"
                  placeholder="Explain the issue with the item"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  required
                />
              </label>

              <label className="field-block">
                <span>Product image</span>
                <div className="upload-box">
                  <input
                    className="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(event) => setImage(event.target.files?.[0] || null)}
                    required
                  />
                  <p>{image ? image.name : "Choose a clear photo of the item"}</p>
                </div>
              </label>

              {lookupError ? <p className="form-message error">{lookupError}</p> : null}
              {!lookupError && trimmedOrderId && trimmedProductId && !productInfo ? (
                <p className="form-message warning">
                  We could not find that order and product combination in the local
                  catalog yet.
                </p>
              ) : null}
              {submitError ? <p className="form-message error">{submitError}</p> : null}

              <button className="primary-button" type="submit" disabled={!canSubmit}>
                {isSubmitting ? "Submitting..." : "Submit return"}
              </button>
            </form>
          </section>

          <div className="dashboard-side-column">
            <section className="panel product-panel">
              <div className="panel-header">
                <div>
                  <p className="section-label">Matched product</p>
                  <h3>Product details</h3>
                </div>
              </div>

              {productInfo ? (
                <div className="product-card">
                  <div className="product-card__image">
                    <img src={productInfo.url} alt={productInfo.name} />
                  </div>
                  <div className="product-card__copy">
                    <h4>{productInfo.name}</h4>
                    <p>{productInfo.specs}</p>
                  </div>
                </div>
              ) : (
                <div className="empty-card">
                  <h4>No product selected yet</h4>
                  <p>
                    Enter a valid order ID and product ID to preview the item
                    details before you submit.
                  </p>
                </div>
              )}
            </section>

            <section className="panel steps-panel">
              <div className="panel-header">
                <div>
                  <p className="section-label">Workflow</p>
                  <h3>How the review works</h3>
                </div>
              </div>
              <ol className="steps-list">
                {steps.map((step, index) => (
                  <li key={step}>
                    <span>{index + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </main>

      {showHistory ? (
        <ReturnHistory user={user} onClose={() => setShowHistory(false)} />
      ) : null}

      {showPopup && popupData ? (
        <GeminiPopup data={popupData} onClose={() => setShowPopup(false)} />
      ) : null}
    </div>
  );
}

export default Dashboard;
