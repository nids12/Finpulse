require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.STOCK_API_KEY;

// Initial stock symbols
let symbols = ["AAPL", "TSLA", "GOOGL"];

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

        io.emit("stockData", stockData);
        console.log(`Sent data for ${symbol}`, stockData);
        // Log the stock data for debugging
        console.log("[DEBUG] Emitted stockData:", stockData);
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err.message);
      }
    }
  };


  setInterval(fetchPrices, 60000);

  // Helper to fetch and emit data for a single symbol
  const fetchAndEmitSymbol = async (symbol) => {
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
      io.emit("stockData", stockData);
      console.log(`[NEW SYMBOL] Emitted stockData:`, stockData);
    } catch (err) {
      console.error(`[NEW SYMBOL] Error fetching ${symbol}:`, err.message);
    }
  };

  
  io.on("connection", (socket) => {
    socket.on("addSymbol", (symbol) => {
      symbol = symbol.toUpperCase().trim();
      if (symbol && !symbols.includes(symbol)) {
        symbols.push(symbol);
        console.log(`New symbol added: ${symbol}`);
        fetchAndEmitSymbol(symbol);
      }
    });
  });
};

module.exports = pollStockPrices;
