const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

// Helper: get or create portfolio for user
async function getOrCreatePortfolio(userId) {
  let portfolio = await Portfolio.findOne({ user: userId });
  if (!portfolio) {
    portfolio = new Portfolio({ user: userId, holdings: [], transactions: [] });
    await portfolio.save();
  }
  return portfolio;
}

// Buy stock
exports.buyStock = async (req, res) => {
  const userId = req.user.userId;
  const { symbol, quantity, price } = req.body;
  if (!symbol || !quantity || !price || quantity <= 0 || price <= 0)
    return res.status(400).json({ error: "Invalid buy request" });
  try {
    const portfolio = await getOrCreatePortfolio(userId);
    let holding = portfolio.holdings.find((h) => h.symbol === symbol);
    if (holding) {
      // Update avg price and quantity
      const totalCost = holding.avgPrice * holding.quantity + price * quantity;
      holding.quantity += quantity;
      holding.avgPrice = totalCost / holding.quantity;
    } else {
      portfolio.holdings.push({ symbol, quantity, avgPrice: price });
    }
    portfolio.transactions.push({
      type: "buy",
      symbol,
      quantity,
      price,
      date: new Date(),
    });
    await portfolio.save();
    res.json({ message: "Stock bought", portfolio });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Sell stock
exports.sellStock = async (req, res) => {
  const userId = req.user.userId;
  const { symbol, quantity, price } = req.body;
  if (!symbol || !quantity || !price || quantity <= 0 || price <= 0)
    return res.status(400).json({ error: "Invalid sell request" });
  try {
    const portfolio = await getOrCreatePortfolio(userId);
    let holding = portfolio.holdings.find((h) => h.symbol === symbol);
    if (!holding || holding.quantity < quantity)
      return res.status(400).json({ error: "Not enough shares to sell" });
    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter(
        (h) => h.symbol !== symbol
      );
    }
    portfolio.transactions.push({
      type: "sell",
      symbol,
      quantity,
      price,
      date: new Date(),
    });
    await portfolio.save();
    res.json({ message: "Stock sold", portfolio });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get portfolio
exports.getPortfolio = async (req, res) => {
  const userId = req.user.userId;
  try {
    const portfolio = await getOrCreatePortfolio(userId);
    res.json({
      holdings: portfolio.holdings,
      transactions: portfolio.transactions,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
