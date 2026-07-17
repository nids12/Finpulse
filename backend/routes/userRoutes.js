const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/balance", auth, userController.getBalance);
router.post("/deposit", auth, userController.deposit);
router.post("/withdraw", auth, userController.withdraw);

router.get("/transactions", auth, userController.getTransactions);

module.exports = router;
