const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const portfolioController = require("../controllers/portfolioController");

// Buy stock
router.post("/buy", auth, portfolioController.buyStock);
// Sell stock
router.post("/sell", auth, portfolioController.sellStock);
// Get portfolio
router.get("/portfolio", auth, portfolioController.getPortfolio);

module.exports = router;
