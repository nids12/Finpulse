const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const portfolioController = require("../controllers/portfolioController");

router.post("/buy", auth, portfolioController.buyStock);
router.post("/sell", auth, portfolioController.sellStock);
router.get("/portfolio", auth, portfolioController.getPortfolio);

module.exports = router;
