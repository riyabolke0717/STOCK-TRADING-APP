const Trade = require("../models/Trade");
const Holding = require("../models/Holding");
const Stock = require("../models/Stock");
const User = require("../models/User");

// @desc    Buy stock
// @route   POST /api/trade/buy
const buyStock = async (req, res) => {
    try {
        const { userId, stockName, stockSymbol, quantity, price } = req.body;

        if (!userId || !stockName || !stockSymbol || !quantity || !price) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const totalAmount = quantity * price;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.balance < totalAmount) {
            return res.status(400).json({ success: false, message: "Insufficient balance" });
        }

        // Deduct balance
        user.balance -= totalAmount;
        await user.save();

        // Save trade
        const trade = await Trade.create({
            userId,
            stockName,
            stockSymbol,
            quantity,
            buyPrice: price,
            totalAmount,
            tradeType: "BUY",
            date: new Date()
        });

        // Update Holdings
        let holding = await Holding.findOne({ userId, stockSymbol });
        if (holding) {
            const totalCost = (holding.quantity * holding.avgPrice) + totalAmount;
            holding.quantity += Number(quantity);
            holding.avgPrice = totalCost / holding.quantity;
            await holding.save();
        } else {
            await Holding.create({
                userId,
                stockName,
                stockSymbol,
                quantity,
                avgPrice: price
            });
        }

        res.status(201).json({ success: true, message: "Stock purchased successfully", trade, newBalance: user.balance });
    } catch (error) {
        console.error("Buy Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Sell stock
// @route   POST /api/trade/sell
const sellStock = async (req, res) => {
    try {
        const { userId, stockSymbol, quantity, price } = req.body;

        if (!userId || !stockSymbol || !quantity || !price) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let holding = await Holding.findOne({ userId, stockSymbol });
        if (!holding || holding.quantity < quantity) {
            return res.status(400).json({ success: false, message: "Insufficient holdings" });
        }

        const totalAmount = quantity * price;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Add to balance
        user.balance += totalAmount;
        await user.save();

        // Save trade
        const trade = await Trade.create({
            userId,
            stockName: holding.stockName,
            stockSymbol,
            quantity,
            buyPrice: price,
            totalAmount,
            tradeType: "SELL",
            date: new Date()
        });

        // Update Holdings
        holding.quantity -= Number(quantity);
        if (holding.quantity <= 0) {
            await Holding.deleteOne({ _id: holding._id });
        } else {
            await holding.save();
        }

        res.status(201).json({ success: true, message: "Stock sold successfully", trade, newBalance: user.balance });
    } catch (error) {
        console.error("Sell Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserHoldings = async (req, res) => {
    try {
        const { userId } = req.params;
        const holdings = await Holding.find({ userId });
        res.json(holdings);
    } catch (error) {
        console.error("Holdings Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { buyStock, sellStock, getUserHoldings };
