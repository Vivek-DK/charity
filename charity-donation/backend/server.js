import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import bodyParser from "body-parser";
import cors from "cors";
import authRouters from './routes/auth.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// 🔑 Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Temporary in-memory DB
const payments = {};

// ✅ Create Order
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: parseInt(amount) * 100, // INR -> paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    payments[order.id] = { status: "pending" };

    res.json(order);
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ✅ Razorpay Webhook
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(req.body); // raw body, not parsed JSON
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      const payment = JSON.parse(req.body).payload.payment.entity;
      console.log("✅ Webhook payment:", payment);

      payments[payment.order_id] = {
        status: payment.status,
        paymentId: payment.id,
      };

      return res.json({ status: "ok" });
    } else {
      console.log("❌ Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }
  }
);

// ✅ Status Check API (frontend polls here)
app.get("/api/payment-status/:orderId", (req, res) => {
  const { orderId } = req.params;
  const payment = payments[orderId] || { status: "pending" };
  res.json(payment);
});

app.use('/api/auth', authRouters);

app.listen(5000, () =>
  console.log("🚀 Server running at http://localhost:5000")
);
