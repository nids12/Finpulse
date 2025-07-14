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

const User = require("../models/User");
const auth = require("../middleware/auth");
const { fetchStockPrice } = require("../services/stockPriceService");

// --- Multi-Watchlist Endpoints ---
// Get all watchlists with live prices
router.get("/watchlists", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const lists = user.watchlists || [];
    // For each watchlist, fetch live prices for all symbols
    const result = await Promise.all(
      lists.map(async (wl) => {
        const prices = await Promise.all(
          (wl.symbols || []).map(async (symbol) => {
            try {
              const price = await fetchStockPrice(symbol);
              return { symbol, price };
            } catch {
              return { symbol, price: null };
            }
          })
        );
        return { name: wl.name, symbols: prices };
      })
    );
    res.json({ watchlists: result });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new watchlist
router.post("/watchlists", auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.watchlists.some((wl) => wl.name === name)) {
      return res.status(400).json({ error: "Watchlist name already exists" });
    }
    user.watchlists.push({ name, symbols: [] });
    await user.save();
    res.json({ message: "Watchlist created" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a watchlist
router.delete("/watchlists/:name", auth, async (req, res) => {
  const { name } = req.params;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.watchlists = user.watchlists.filter((wl) => wl.name !== name);
    await user.save();
    res.json({ message: "Watchlist deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add symbol to a watchlist
router.post("/watchlists/:name/add", auth, async (req, res) => {
  const { name } = req.params;
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const wl = user.watchlists.find((wl) => wl.name === name);
    if (!wl) return res.status(404).json({ error: "Watchlist not found" });
    if (!wl.symbols.includes(symbol)) {
      wl.symbols.push(symbol);
      await user.save();
    }
    res.json({ message: "Added to watchlist" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Remove symbol from a watchlist
router.post("/watchlists/:name/remove", auth, async (req, res) => {
  const { name } = req.params;
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const wl = user.watchlists.find((wl) => wl.name === name);
    if (!wl) return res.status(404).json({ error: "Watchlist not found" });
    wl.symbols = wl.symbols.filter((s) => s !== symbol);
    await user.save();
    res.json({ message: "Removed from watchlist" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

const User = require("../models/User");
const auth = require("../middleware/auth");
const { fetchStockPrice } = require("../services/stockPriceService");

// --- Multi-Watchlist Endpoints ---
// Get all watchlists with live prices
router.get("/watchlists", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const lists = user.watchlists || [];
    // For each watchlist, fetch live prices for all symbols
    const result = await Promise.all(
      lists.map(async (wl) => {
        const prices = await Promise.all(
          (wl.symbols || []).map(async (symbol) => {
            try {
              const price = await fetchStockPrice(symbol);
              return { symbol, price };
            } catch {
              return { symbol, price: null };
            }
          })
        );
        return { name: wl.name, symbols: prices };
      })
    );
    res.json({ watchlists: result });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new watchlist
router.post("/watchlists", auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.watchlists.some((wl) => wl.name === name)) {
      return res.status(400).json({ error: "Watchlist name already exists" });
    }
    user.watchlists.push({ name, symbols: [] });
    await user.save();
    res.json({ message: "Watchlist created" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a watchlist
router.delete("/watchlists/:name", auth, async (req, res) => {
  const { name } = req.params;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.watchlists = user.watchlists.filter((wl) => wl.name !== name);
    await user.save();
    res.json({ message: "Watchlist deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add symbol to a watchlist
router.post("/watchlists/:name/add", auth, async (req, res) => {
  const { name } = req.params;
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const wl = user.watchlists.find((wl) => wl.name === name);
    if (!wl) return res.status(404).json({ error: "Watchlist not found" });
    if (!wl.symbols.includes(symbol)) {
      wl.symbols.push(symbol);
      await user.save();
    }
    res.json({ message: "Added to watchlist" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Remove symbol from a watchlist
router.post("/watchlists/:name/remove", auth, async (req, res) => {
  const { name } = req.params;
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: "Symbol is required" });
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const wl = user.watchlists.find((wl) => wl.name === name);
    if (!wl) return res.status(404).json({ error: "Watchlist not found" });
    wl.symbols = wl.symbols.filter((s) => s !== symbol);
    await user.save();
    res.json({ message: "Removed from watchlist" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
