require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

const app = express();

// Logging middleware (Move to top)
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.originalUrl || req.url}`);
    next();
});

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health Check Route
app.get("/", (req, res) => {
    res.json({ message: "Stock Trading API is running..." });
});

// Test Route
app.get("/api/test", (req, res) => {
    res.json({ message: "API is accessible" });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/market", require("./routes/marketRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/trade", require("./routes/tradeRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

// 404 Handler
app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.originalUrl || req.url}`);
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl || req.url}` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
