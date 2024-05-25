const express = require("express");
const router = express.Router();
const airportController = require("../controllers/airportController");

router.get("/airport/:id?", airportController.getAirport);
router.post("/airport", airportController.addAirport);
router.delete("/airport/:id", airportController.deleteAirport);
router.put("/airport/:id", airportController.updateAirportFull);
router.patch("/airport/:id", airportController.updateAirport);

module.exports = router;
