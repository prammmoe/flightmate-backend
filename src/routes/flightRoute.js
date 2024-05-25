const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flightController");

router.get("/flights/:id?", flightController.getFlight);
router.post("/flights", flightController.addFlight);
router.put("/flights/:id", flightController.updateFlightFull);
router.patch("/flights/:id", flightController.updateFlight);
router.delete("/flights/:id", flightController.deleteFlight);
router.get("/search", flightController.searchFlights);

module.exports = router;
