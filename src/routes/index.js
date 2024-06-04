const router = require("express").Router();

const aircraftRoute = require("./aircraft/aircraftRoute");
const airportRoute = require("./airport/airportRoute");
const bookingRoute = require("./booking/bookingRoute");
const flightRoute = require("./flight/flightRoute");
const paymentRoute = require("./payment/paymentRoute");
const userRoute = require("./user/userRoute");

router.use("/api/aircraft", aircraftRoute);
router.use("/api/airport", airportRoute);
router.use("/api/booking", bookingRoute);
router.use("/api/flight", flightRoute);
router.use("/api/payment", paymentRoute);
router.use("/api/user", userRoute);

module.exports = router;
