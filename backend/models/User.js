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
  // You can add more fields like email, preferences, etc.
});

module.exports = mongoose.model("User", userSchema);
