<div className="card-grid">
  {history.map((item) => (
    <div
      key={item.id}
      className={`return-card ${
        item.finalDecision?.toLowerCase() === "accept" ? "accepted" : "rejected"
      }`}
    >
      <div className="card-header">
        <div>
          <strong>Order Id:</strong> {item.orderId} &nbsp;&nbsp; 
          <strong>Product Id:</strong> {item.productId}
        </div>
        <div
          className={`status-pill ${
            item.finalDecision?.toLowerCase() === "accept"
              ? "pill-accept"
              : "pill-reject"
          }`}
        >
          Status: {item.finalDecision}
        </div>
      </div>
      <hr />
      <div className="card-body">
        <div className="img-placeholder" />
        <div className="card-details">
          <p className="product-title">Product Name &nbsp; <b>Model</b></p>
          <p className="product-desc">Product Description</p>
          <p className="return-reason">{item.reason}</p>
        </div>
        <div className="card-meta">
          <p><b>Date of request:</b> <br />
            {item.timestamp?.seconds &&
              new Date(item.timestamp.seconds * 1000).toLocaleDateString()}
          </p>
          <p><b>Decision:</b><br />{item.finalDecision}</p>
          <p><b>Rejection Reason:</b><br />{item.rejectionReason || "N/A"}</p>
        </div>
      </div>
    </div>
  ))}
</div>
