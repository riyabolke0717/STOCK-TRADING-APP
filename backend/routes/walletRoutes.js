const express = require("express");
const router = express.Router();
const {
    depositMoney,
    withdrawMoney,
    getUserTransactions
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

// All wallet routes are protected
router.use(protect);

router.post("/deposit", depositMoney);
router.post("/withdraw", withdrawMoney);
router.get("/transactions", getUserTransactions);

module.exports = router;
