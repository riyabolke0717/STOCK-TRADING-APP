const express = require("express");
const router = express.Router();
const { getMarkets } = require("../controllers/marketController");

router.get("/", getMarkets);

module.exports = router;