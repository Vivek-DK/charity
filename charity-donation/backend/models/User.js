import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    aadhaar: { type: String, required: true, unique: true }, // 12 digits
    mobile: { type: String }, // optional but stored at signup
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// Optional basic Aadhaar/mob validation
userSchema.path("aadhaar").validate(function (v) {
  return /^[2-9]\d{11}$/.test(v); // basic: 12 digits, first 2-9 (not full Verhoeff)
}, "Invalid Aadhaar number format.");

export default mongoose.model("User", userSchema);
