const axios = require("axios");

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;

async function fetchStockPrice(symbol) {
  const url = `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`;
  try {
    const response = await axios.get(url);
    console.log("Twelve Data API response:", response.data); // Debug log
    if (response.data && response.data.price) {
      return parseFloat(response.data.price);
    } else {
      throw new Error(response.data.message || "Price not found");
    }
  } catch (error) {
    if (error.response) {
      console.error("Twelve Data API error response:", error.response.data);
    } else {
      console.error("Twelve Data API error:", error.message);
    }
    throw new Error("Error fetching stock price: " + error.message);
  }
}

module.exports = { fetchStockPrice };
