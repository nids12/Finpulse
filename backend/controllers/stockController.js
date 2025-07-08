const { fetchStockPrice } = require("../services/stockPriceService");

// Live price endpoint using Twelve Data
const getStockPrice = async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }
  try {
    const price = await fetchStockPrice(symbol);
    res.json({ symbol, price });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStockPrice };
