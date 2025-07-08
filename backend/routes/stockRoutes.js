const express = require("express");
const router = express.Router();
const { getStockPrice } = require("../controllers/stockController");
const Stock = require("../models/Stock");

// Live price route
router.get("/price", getStockPrice);

// Last 20 records for a symbol
router.get("/history/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const data = await Stock.find({ symbol })
      .sort({ time: -1 })
      .limit(20)
      .lean();
    res.json(data.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
