const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/auth");
const paymentController = require("../../controllers/payment/paymentController");

router.get("/:id?", verifyToken, paymentController.getPayment);
router.post("/create", paymentController.createPayment);
router.post("/process", verifyToken, paymentController.checkoutPayment);
router.get("/status/:order_id", paymentController.getPaymentStatus);

module.exports = router;
