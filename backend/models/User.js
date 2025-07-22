const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlists: [
    {
      name: { type: String, required: true },
      symbols: [{ type: String }],
    },
  ], // Array of { name, symbols[] }
  balance: { type: Number, default: 0 }, // User's account balance
  transactions: [
    {
      type: { type: String, enum: ["deposit", "withdraw"], required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ], // Deposit/withdraw history
  // You can add more fields like email, preferences, etc.
});

module.exports = mongoose.model("User", userSchema);
