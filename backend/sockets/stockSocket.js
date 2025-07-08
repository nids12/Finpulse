const axios = require("axios");
const Stock = require("../models/Stock"); // ✅ Step 1: Import Stock model

const symbols = ["AAPL", "TSLA", "GOOGL"];
const API_KEY = process.env.STOCK_API_KEY;

const startPolling = (io) => {
  const fetchPrices = async () => {
    for (const symbol of symbols) {
      try {
        const response = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
        );

        const data = response.data;
        const stockData = {
          symbol,
          current: data.c,
          high: data.h,
          low: data.l,
          open: data.o,
          prevClose: data.pc,
          time: new Date(),
        };

        io.emit("stockData", stockData); // emit to frontend
        await Stock.create(stockData); // ✅ Step 2: save to MongoDB

        console.log(`📡 Sent and saved data for ${symbol}`, stockData);
      } catch (err) {
        console.error(`❌ Error fetching ${symbol}:`, err.message);
      }
    }
  };

  // poll every 5 seconds
  setInterval(fetchPrices, 5000);
};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("📡 Client connected:", socket.id);

    socket.emit("welcome", "Connected to FinPulse WebSocket!");

    if (io.engine.clientsCount === 1) {
      startPolling(io); // start polling only once
    }

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};
