const express = require("express");
const router = express.Router();
const bookingController = require("../../controllers/booking/bookingController");
const { verifyToken } = require("../../middlewares/auth");

router.get("/:id?", verifyToken, bookingController.getBooking);
router.post("/", bookingController.createBooking);
router.delete("/:id", verifyToken, bookingController.deleteBooking);
router.put("/:id", verifyToken, bookingController.updateBookingFull);
router.patch("/:id", verifyToken, bookingController.updateBooking);

module.exports = router;
