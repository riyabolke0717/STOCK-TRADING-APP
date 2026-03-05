// models/order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stockSymbol: {
    type: String,
    required: true,
  },
  stockName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  orderType: {
    type: String,
    enum: ["BUY", "SELL"],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Important Indexes (Performance)
orderSchema.index({ userId: 1 });

module.exports = mongoose.model("Order", orderSchema);