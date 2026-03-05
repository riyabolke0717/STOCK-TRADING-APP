const express = require("express");
const router = express.Router();
const { getStockPrice, getTopGainers } = require("../controllers/marketController");

// NOTE: /top-gainers must come BEFORE /:symbol to avoid route conflict
router.get("/top-gainers", getTopGainers);
router.get("/:symbol", getStockPrice);

module.exports = router;