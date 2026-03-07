const Holding = require("../models/Holding");
const Trade = require("../models/Trade");
const Stock = require("../models/Stock");

// @desc    Get Dashboard Data
// @route   GET /api/dashboard/:userId
const getDashboardData = async (req, res) => {
    try {
        const { userId } = req.params;

        const holdings = await Holding.find({ userId });
        const stocks = await Stock.find({});

        // Create a map for quick price lookup
        const priceMap = {};
        stocks.forEach(s => {
            priceMap[s.symbol] = s.price;
        });

        let totalValue = 0;
        let activeHoldings = holdings.length;

        holdings.forEach(h => {
            const currentPrice = priceMap[h.stockSymbol] || 0;
            totalValue += currentPrice * h.quantity;
        });

        // Today's Returns = (Current price - buy price) × quantity for today's trades
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const todayTrades = await Trade.find({
            userId,
            date: { $gte: startOfToday },
            tradeType: "BUY"
        });

        let todaysReturns = 0;
        todayTrades.forEach(trade => {
            const currentPrice = priceMap[trade.stockSymbol] || 0;
            todaysReturns += (currentPrice - trade.buyPrice) * trade.quantity;
        });

        res.json({
            totalValue: totalValue.toFixed(2),
            todaysReturns: todaysReturns.toFixed(2),
            activeHoldings
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardData };
