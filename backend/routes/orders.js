const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// BUY stock
router.post("/buy", async (req, res) => {
  try {
    const { userId, symbol, quantity, price } = req.body;

    const order = new Order({
      userId,
      symbol,
      quantity,
      price,
      type: "BUY",
    });

    await order.save();
    res.json({ message: "Stock bought successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders of user
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;