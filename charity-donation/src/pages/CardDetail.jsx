import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./CardDetail.css";

const CardDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const detail = location.state;

  const [showDonate, setShowDonate] = useState(false);
  const [amount, setAmount] = useState("");

  const handleDonateClick = () => {
    setShowDonate(true);
  };

  const handleRazorpayPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return alert("Please enter a valid amount.");
    }

    try {
      // 1. Create order from backend
      const res = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();

      if (!data.orderId) {
        return alert("Failed to create order. Try again.");
      }

      // 2. Open Razorpay popup
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // put your key in frontend .env
        amount: data.amount,
        currency: data.currency,
        name: "Charity Donation",
        description: detail.title,
        order_id: data.orderId,
        handler: async function (response) {
          // 3. Verify payment
          const verifyRes = await fetch("http://localhost:5000/api/payment-verification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("🎉 Payment Successful! Thank you for donating.");
          } else {
            alert("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: "Charity Supporter",
          email: "donor@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  if (!detail) {
    return <h2 style={{ textAlign: "center", marginTop: "100px" }}>No Data Found</h2>;
  }

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => window.history.back()}>⬅ Back</button>

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

        {showDonate && (
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
      </div>
    </div>
  );
};

export default CardDetail;
