const mongoose = require("mongoose");
const { getStockDB } = require("../config/db");

const marketSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    company_name: String,
    price: Number,
    open: Number,
    high: Number,
    low: Number,
    volume: Number,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Important Indexes (Performance)
marketSchema.index({ symbol: 1 }, { unique: true });

// Export a function to get the model on the stockDB connection
module.exports = () => {
    const db = getStockDB();
    return db.models.Market || db.model("Market", marketSchema, "markets");
};