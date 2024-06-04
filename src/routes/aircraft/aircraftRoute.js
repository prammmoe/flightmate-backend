const express = require("express");
const router = express.Router();
const aircraftController = require("../../controllers/aircraft/aircraftController");

router.get("/:id?", aircraftController.getAircraft);
router.post("/", aircraftController.addAircraft);
router.put("/:id", aircraftController.updateAircraftFull);
router.patch("/:id", aircraftController.updateAircraft);
router.delete("/:id", aircraftController.deleteAircraft);

module.exports = router;
