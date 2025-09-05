import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./CardDetail.css";

const CardDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const detail = location.state;

  const [showDonate, setShowDonate] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);

  const handleDonateClick = () => {
    setShowDonate(true);
  };

  const handleRazorpayPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return alert("Please enter a valid amount.");
    }

    try {
      // 1️⃣ Create order
      const res = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await res.json();

      if (!order.id) {
        return alert("Failed to create order");
      }

      // 2️⃣ Razorpay popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Charity Fund",
        description: detail.title,
        order_id: order.id,
        handler: function () {
          pollPaymentStatus(order.id);
        },
        prefill: { name: "Donor", email: "donor@example.com" },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  // 3️⃣ Poll backend until status = captured
  const pollPaymentStatus = (orderId) => {
    const interval = setInterval(async () => {
      const res = await fetch(
        `http://localhost:5000/api/payment-status/${orderId}`
      );
      const data = await res.json();
      if (data.status === "captured") {
        clearInterval(interval);
        setPaymentDone(true);
      }
    }, 3000);
  };

  if (!detail) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        No Data Found
      </h2>
    );
  }

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => window.history.back()}>
        ⬅ Back
      </button>

      <div className="detail-card">
        <img src={detail.image} alt={detail.title} className="detail-img" />
        <h1 className="detail-title">{detail.title}</h1>
        <p className="detail-story">{detail.story}</p>
        <div className="detail-info">
          <span className="detail-date">📅 {detail.date}</span>
          <span className="detail-raised">💰 {detail.raised}</span>
        </div>

        <button className="donate-btn" onClick={handleDonateClick}>
          Donate Fund
        </button>

        {showDonate && !paymentDone && (
          <div className="donate-section">
            <input
              type="number"
              placeholder="Enter amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="donate-input"
            />
            <button className="generate-btn" onClick={handleRazorpayPayment}>
              Pay with UPI
            </button>
          </div>
        )}

        {paymentDone && (
          <div className="success-animation">
             Payment Successful! Thank you 
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetail;
