const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: String,
  name: String, // Full company name
  current: Number,
  high: Number,
  low: Number,
  open: Number,
  prevClose: Number,
  time: Date,
});

module.exports = mongoose.model("Stock", stockSchema);
