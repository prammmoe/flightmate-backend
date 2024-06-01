const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const paymentController = require("../controllers/paymentController");

router.get("/payment/:id?", verifyToken, paymentController.getPaymentById);
router.post("/payment", verifyToken, paymentController.checkoutPayment);
router.get("/status/:order_id", paymentController.getPaymentStatus);
module.exports = router;
