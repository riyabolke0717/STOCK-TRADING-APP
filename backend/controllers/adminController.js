const User = require("../models/User");
const Order = require("../models/order");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort("-created_at");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Delete a user and their orders
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(400).json({ message: "Cannot delete an admin account" });
        }

        // Cascade delete orders
        await Order.deleteMany({ userId: user._id });
        await User.deleteOne({ _id: user._id });

        res.json({ message: "User and associated orders deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Block or unblock a user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(400).json({ message: "Cannot block an admin account" });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({
            message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
            isBlocked: user.isBlocked,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get a single user's profile (admin view)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getAllUsers, deleteUser, blockUser, getUserById };
