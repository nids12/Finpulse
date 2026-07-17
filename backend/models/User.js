const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlists: [
    {
      name: { type: String, required: true },
      symbols: [{ type: String }],
    },
  ], 
  balance: { type: Number, default: 0 },
  transactions: [
    {
      type: { type: String, enum: ["deposit", "withdraw"], required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ], // Deposit/withdraw history
});

module.exports = mongoose.model("User", userSchema);
