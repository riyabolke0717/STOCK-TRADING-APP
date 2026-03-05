const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["deposit", "withdrawal"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

// Important Indexes (Performance)
transactionSchema.index({ user_id: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
