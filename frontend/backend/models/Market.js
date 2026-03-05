const mongoose = require("mongoose");

const MarketSchema = new mongoose.Schema({
    symbol: String,
    companyName: String,
    price: Number,
});

module.exports = mongoose.model("Market", MarketSchema);