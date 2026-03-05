const express = require("express");
const router = express.Router();
const {
    buyStock,
    sellStock,
    getUserOrders,
    getAllOrders,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/buy", protect, buyStock);
router.post("/sell", protect, sellStock);
router.get("/all", protect, admin, getAllOrders);
router.get("/user/:userId", protect, getUserOrders);

module.exports = router;
