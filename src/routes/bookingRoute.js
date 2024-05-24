const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.get("/bookings/:id?", bookingController.getBooking);
router.post("/bookings", bookingController.createBooking);
router.delete("/bookings/:id", bookingController.deleteBooking);
router.put("/bookings/:id", bookingController.updateBookingFull);
router.patch("/bookings/:id", bookingController.updateBooking);

module.exports = router;
