const express = require("express");
const router = express.Router();
const { buyStock, sellStock, getUserHoldings } = require("../controllers/tradeController");

router.post("/buy", buyStock);
router.post("/sell", sellStock);
router.get("/holdings/:userId", getUserHoldings);

module.exports = router;
