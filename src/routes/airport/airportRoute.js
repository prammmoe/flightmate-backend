const express = require("express");
const router = express.Router();
const airportController = require("../../controllers/airport/airportController");

router.get("/:id?", airportController.getAirport);
router.post("/", airportController.addAirport);
router.delete("/:id", airportController.deleteAirport);
router.put("/:id", airportController.updateAirportFull);
router.patch("/:id", airportController.updateAirport);

module.exports = router;
