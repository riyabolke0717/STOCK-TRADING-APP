// models/User.js
const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  symbol: String,
  quantity: Number,
  avg_price: Number
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  balance: {
    type: Number,
    default: 10000,
  },
  portfolio: [portfolioSchema],
  isBlocked: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastResetRequest: Date
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Important Indexes (Performance)
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);