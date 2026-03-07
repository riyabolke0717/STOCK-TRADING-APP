const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema({
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
        default: 0,
    },
    avgPrice: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Holding", holdingSchema);
