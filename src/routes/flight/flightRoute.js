const express = require("express");
const router = express.Router();
const flightController = require("../../controllers/flight/flightController");

router.get("/:id?", flightController.getFlight);
router.post("/create", flightController.addFlight);
router.put("/:id", flightController.updateFlightFull);
router.patch("/:id", flightController.updateFlight);
router.delete("/:id", flightController.deleteFlight);
router.get("/search", flightController.searchFlights);
router.get("/cities", flightController.getAllCities);

module.exports = router;
