const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Get current balance
router.get("/balance", auth, userController.getBalance);
// Deposit money
router.post("/deposit", auth, userController.deposit);
// Withdraw money
router.post("/withdraw", auth, userController.withdraw);

// Get transaction history
router.get("/transactions", auth, userController.getTransactions);

module.exports = router;
