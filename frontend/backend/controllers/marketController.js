const Market = require("../models/Market");

exports.getMarkets = async (req, res) => {
    const markets = await Market.find();
    res.json({ success: true, data: markets });
};