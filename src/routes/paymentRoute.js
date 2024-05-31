const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const paymentController = require("../controllers/paymentController");

router.post("/payment", verifyToken, paymentController.checkoutPayment);

module.exports = router;
