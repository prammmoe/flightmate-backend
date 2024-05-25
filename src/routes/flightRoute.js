const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flightController");

router.get("/:id?", flightController.getFlight);
router.post(flightController.addFlight);
router.put("/:id", flightController.updateFlightFull);
router.patch("/:id", flightController.updateFlight);
router.delete("/:id", flightController.deleteFlight);
router.get("/search", flightController.searchFlights);

module.exports = router;
