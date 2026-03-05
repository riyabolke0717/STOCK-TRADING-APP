const mongoose = require("mongoose");

let stockDBConnection = null;

const connectDB = async () => {
  try {
    // Connect to the primary database (stock-trading)
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected: stock-trading (Primary)");

    // Initialize secondary connection (stockDB)
    // We reuse the same connection host but specify a different database
    stockDBConnection = conn.connection.useDb("stockDB");
    console.log("MongoDB Connected: stockDB (Secondary)");

  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};

const getStockDB = () => {
  if (!stockDBConnection) {
    throw new Error("stockDBConnection is not initialized.");
  }
  return stockDBConnection;
};

module.exports = { connectDB, getStockDB, mongoose };