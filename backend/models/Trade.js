const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    stockName: {
        type: String,
        required: true,
    },
    stockSymbol: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    buyPrice: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    tradeType: {
        type: String,
        enum: ["BUY", "SELL"],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = mongoose.model("Trade", tradeSchema);
