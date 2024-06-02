const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken } = require("../middlewares/auth");

router.get("/bookings/:id?", /*verifyToken,*/ bookingController.getBooking);
router.post("/bookings", bookingController.createBooking);
router.delete(
  "/bookings/:id",
  /*verifyToken,*/ bookingController.deleteBooking
);
router.put(
  "/bookings/:id",
  /*verifyToken,*/ bookingController.updateBookingFull
);
router.patch("/bookings/:id", /*verifyToken,*/ bookingController.updateBooking);

module.exports = router;
