const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendResetEmail } = require("../utils/sendEmail");

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "SECRETKEY", {
        expiresIn: "30d",
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "Please provide all fields including mobile no" });
        }

        const userExists = await User.findOne({ $or: [{ email }, { phone }] });

        if (userExists) {
            return res.status(400).json({ message: "User with this email or phone already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            balance: 10000,
            portfolio: []
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                balance: user.balance,
                portfolio: user.portfolio,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { phone, email, password } = req.body;

        if ((!phone && !email) || !password) {
            return res.status(400).json({ message: "Please provide mobile no (or email) and password" });
        }

        const query = phone ? { phone } : { email };
        const user = await User.findOne(query);

        if (user && (await bcrypt.compare(password, user.password))) {
            if (user.isBlocked) {
                return res.status(403).json({ message: "User is blocked by admin" });
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                balance: user.balance,
                portfolio: user.portfolio,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
        user.lastResetRequest = Date.now();

        await user.save();

        // Send actual email
        await sendResetEmail(user.email, resetToken);

        res.json({ message: "Reset link sent to your email" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const token = req.params.token || req.body.token;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Invalid token or password" });
        }

        // Hash token from body to compare with DB
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ message: "Password has been reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
};
