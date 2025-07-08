require("dotenv").config();
const axios = require("axios");
const Stock = require("./models/Stock"); // ✅ import the model

const symbols = ["AAPL", "TSLA", "GOOGL"];
const API_KEY = process.env.STOCK_API_KEY;

const pollStockPrices = (io) => {
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
          time: new Date().toISOString(),
        };

        // ✅ Save to MongoDB
        await Stock.create(stockData);

        // Emit to clients
        io.emit("stockData", stockData);
        console.log(`📡 Sent data for ${symbol}`, stockData);
      } catch (err) {
        console.error(`❌ Error fetching ${symbol}:`, err.message);
      }
    }
  };

  setInterval(fetchPrices, 5000);
};

module.exports = pollStockPrices;
