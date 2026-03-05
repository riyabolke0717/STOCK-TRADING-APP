// models/Stock.js
const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: { type: String, unique: true },
  name: String,
  price: Number,
  change: Number,
  updatedAt: Date
});

module.exports = mongoose.model("Stock", stockSchema);