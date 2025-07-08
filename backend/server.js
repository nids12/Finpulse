// Load .env before using process.env.*
require("dotenv").config();

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const stockRoutes = require("./routes/stockRoutes");
const stockSocket = require("./sockets/stockSocket");
const portfolioRoutes = require("./routes/portfolioRoutes");

// Express app and HTTP server
const app = express();
const server = http.createServer(app);

// WebSocket setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// REST API route
app.use("/api/stocks", stockRoutes);
app.use("/api/stocks", portfolioRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ✅ Start polling stock prices and emitting via socket.io
stockSocket(io); // 💡 Important: keep this after io is created

// Start the backend server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
