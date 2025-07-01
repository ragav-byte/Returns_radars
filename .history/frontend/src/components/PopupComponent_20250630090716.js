// components/PopupComponent.js
import React from "react";
import savePopupData from "../firebase/savePopupData";

function PopupComponent() {
  const handleSavePopup = async () => {
    const popupData = {
      title: "Return Status",
      result: "ACCEPTED",
      reason: "Genuine issue with packaging"
    };

    try {
      const id = await savePopupData(popupData);
      alert(`Popup saved with ID: ${id}`);
    } catch (err) {
      alert("Error saving popup: " + err.message);
    }
  };

  return (
    <div>
      <button onClick={handleSavePopup}>Save Popup to Firestore</button>
    </div>
  );
}

export default PopupComponent;
