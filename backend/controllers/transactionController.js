const Transaction = require("../models/Transaction");
const User = require("../models/User");

// @desc    Deposit money to wallet
// @route   POST /api/wallet/deposit
// @access  Private
const depositMoney = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid deposit amount" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.balance += Number(amount);
        await user.save();

        const transaction = await Transaction.create({
            user_id: user._id,
            type: "deposit",
            amount: Number(amount)
        });

        res.status(201).json({
            message: "Deposit successful",
            transaction,
            newBalance: user.balance
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Withdraw money from wallet
// @route   POST /api/wallet/withdraw
// @access  Private
const withdrawMoney = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid withdrawal amount" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance for withdrawal" });
        }

        user.balance -= Number(amount);
        await user.save();

        const transaction = await Transaction.create({
            user_id: user._id,
            type: "withdrawal",
            amount: Number(amount)
        });

        res.status(201).json({
            message: "Withdrawal successful",
            transaction,
            newBalance: user.balance
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get user transactions
// @route   GET /api/wallet/transactions
// @access  Private
const getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.user._id }).sort("-date");
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    depositMoney,
    withdrawMoney,
    getUserTransactions
};
