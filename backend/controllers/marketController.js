const axios = require("axios");

const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// @desc    Get live stock quote for a symbol
// @route   GET /api/market/:symbol
// @access  Public
const getStockPrice = async (req, res) => {
    try {
        const { symbol } = req.params;

        if (!symbol) {
            return res.status(400).json({ message: "Stock symbol is required" });
        }

        const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
            params: {
                function: "GLOBAL_QUOTE",
                symbol: symbol.toUpperCase(),
                apikey: API_KEY,
            },
        });

        const data = response.data;

        if (data["Note"]) {
            return res.status(429).json({
                message: "API call limit reached. Please try again later.",
                note: data["Note"],
            });
        }

        if (data["Error Message"]) {
            return res.status(400).json({ message: "Invalid stock symbol" });
        }

        const quote = data["Global Quote"];

        if (!quote || Object.keys(quote).length === 0) {
            return res.status(404).json({ message: `No data found for symbol: ${symbol}` });
        }

        res.json({
            symbol: quote["01. symbol"],
            open: parseFloat(quote["02. open"]),
            high: parseFloat(quote["03. high"]),
            low: parseFloat(quote["04. low"]),
            price: parseFloat(quote["05. price"]),
            volume: parseInt(quote["06. volume"]),
            latestTradingDay: quote["07. latest trading day"],
            previousClose: parseFloat(quote["08. previous close"]),
            change: parseFloat(quote["09. change"]),
            changePercent: quote["10. change percent"],
        });
    } catch (error) {
        console.error("Market fetch error:", error.message);
        res.status(500).json({ message: "Failed to fetch stock data", error: error.message });
    }
};

// @desc    Get top gainers from the market
// @route   GET /api/market/top-gainers
// @access  Public
const getTopGainers = async (req, res) => {
    try {
        const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
            params: {
                function: "TOP_GAINERS_LOSERS",
                apikey: API_KEY,
            },
        });

        const data = response.data;

        if (data["Note"]) {
            return res.status(429).json({
                message: "API call limit reached. Please try again later.",
                note: data["Note"],
            });
        }

        if (data["Error Message"]) {
            return res.status(400).json({ message: "Failed to fetch top gainers" });
        }

        const topGainers = data["top_gainers"] || [];
        const topLosers = data["top_losers"] || [];
        const mostActivelyTraded = data["most_actively_traded"] || [];

        res.json({ topGainers, topLosers, mostActivelyTraded });
    } catch (error) {
        console.error("Top gainers fetch error:", error.message);
        res.status(500).json({ message: "Failed to fetch top gainers", error: error.message });
    }
};

module.exports = { getStockPrice, getTopGainers };