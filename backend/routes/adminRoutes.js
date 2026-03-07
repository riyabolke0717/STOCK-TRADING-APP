const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    deleteUser,
    blockUser,
    getUserById,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// All admin routes require authentication + admin role
router.use(protect, admin);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.put("/block-user/:id", blockUser);

module.exports = router;
