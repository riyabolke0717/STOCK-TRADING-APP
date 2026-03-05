const Order = require("../models/order");
const User = require("../models/User");

// Helper to update portfolio array
const modifyPortfolio = (portfolio, symbol, qty, price, isBuy) => {
    let itemIndex = portfolio.findIndex((p) => p.symbol === symbol);

    if (isBuy) {
        if (itemIndex > -1) {
            let item = portfolio[itemIndex];
            // Calculate new average price
            const totalCost = (item.quantity * item.avg_price) + (qty * price);
            item.quantity += qty;
            item.avg_price = totalCost / item.quantity;
        } else {
            portfolio.push({ symbol, quantity: qty, avg_price: price });
        }
    } else { // SELL
        if (itemIndex > -1) {
            let item = portfolio[itemIndex];
            item.quantity -= qty;
            if (item.quantity === 0) {
                portfolio.splice(itemIndex, 1);
            }
        }
    }
    return portfolio;
};

// @desc    Buy stock
// @route   POST /api/orders/buy
// @access  Private
const buyStock = async (req, res) => {
    try {
        const { stockSymbol, stockName, quantity, price } = req.body;

        if (!stockSymbol || !stockName || !quantity || !price) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than 0" });
        }

        const totalAmount = quantity * price;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.balance < totalAmount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Deduct balance and update portfolio
        user.balance -= totalAmount;
        user.portfolio = modifyPortfolio(user.portfolio, stockSymbol, quantity, price, true);
        await user.save();

        const order = await Order.create({
            userId: user._id,
            stockSymbol,
            stockName,
            quantity,
            price,
            orderType: "BUY",
            totalAmount,
            status: "completed"
        });

        res.status(201).json({ message: "Stock bought successfully", order, newBalance: user.balance, portfolio: user.portfolio });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Sell stock
// @route   POST /api/orders/sell
// @access  Private
const sellStock = async (req, res) => {
    try {
        const { stockSymbol, stockName, quantity, price } = req.body;

        if (!stockSymbol || !stockName || !quantity || !price) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than 0" });
        }

        const totalAmount = quantity * price;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check portfolio using the direct array now!
        const portfolioItem = user.portfolio.find(p => p.symbol === stockSymbol);
        const ownedQuantity = portfolioItem ? portfolioItem.quantity : 0;

        if (ownedQuantity < quantity) {
            return res.status(400).json({ message: `Insufficient stocks. You own ${ownedQuantity} of ${stockSymbol}.` });
        }

        // Add to balance and update portfolio
        user.balance += totalAmount;
        user.portfolio = modifyPortfolio(user.portfolio, stockSymbol, quantity, price, false);
        await user.save();

        const order = await Order.create({
            userId: user._id,
            stockSymbol,
            stockName,
            quantity,
            price,
            orderType: "SELL",
            totalAmount,
            status: "completed"
        });

        res.status(201).json({ message: "Stock sold successfully", order, newBalance: user.balance, portfolio: user.portfolio });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/user/:userId
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to view these orders" });
        }

        const orders = await Order.find({ userId: req.params.userId }).sort("-created_at");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email").sort("-created_at");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    buyStock,
    sellStock,
    getUserOrders,
    getAllOrders,
};
