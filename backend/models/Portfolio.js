const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  holdings: [
    {
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true, min: 0 },
      avgPrice: { type: Number, required: true, min: 0 }, // average buy price
    },
  ],
  transactions: [
    {
      type: { type: String, enum: ["buy", "sell"], required: true },
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
