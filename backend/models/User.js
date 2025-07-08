const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // You can add more fields like email, watchlist, preferences, etc.
});

module.exports = mongoose.model("User", userSchema);
