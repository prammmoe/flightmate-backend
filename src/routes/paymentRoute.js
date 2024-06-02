const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const paymentController = require("../controllers/paymentController");

router.get("/payment/:id?", /*verifyToken,*/ paymentController.getPayment);
router.post("/payment", paymentController.createPayment);
router.post(
  "/payment/process",
  /*verifyToken,*/ paymentController.checkoutPayment
);
router.get("/status/:order_id", paymentController.getPaymentStatus);

module.exports = router;
