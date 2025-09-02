import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import crypto from "crypto";
import authRouters from './routes/auth.js';
import cors from "cors";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors())

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create UPI Order
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // INR -> paise
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ✅ Verify Payment (Webhook endpoint)
app.post("/payment-verification", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    // Payment is verified ✅
    console.log("Payment Success:", razorpay_payment_id);
    return res.json({ status: "success", paymentId: razorpay_payment_id });
  } else {
    return res.status(400).json({ status: "failure" });
  }
});

app.use('/api/auth', authRouters);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
