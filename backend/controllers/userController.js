const User = require("../models/User");

// Get current balance
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Deposit money
exports.deposit = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0)
      return res.status(400).json({ error: "Invalid amount" });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.balance += amount;
    user.transactions.push({ type: "deposit", amount });
    await user.save();
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Withdraw money
exports.withdraw = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0)
      return res.status(400).json({ error: "Invalid amount" });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.balance < amount)
      return res.status(400).json({ error: "Insufficient balance" });
    user.balance -= amount;
    user.transactions.push({ type: "withdraw", amount });
    await user.save();
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get transaction history
exports.getTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    // Return most recent first
    const txs = [...user.transactions].reverse();
    res.json({ transactions: txs });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
