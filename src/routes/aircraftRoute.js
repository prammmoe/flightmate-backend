const express = require("express");
const router = express.Router();
const aircraftController = require("../controllers/aircraftController");

router.get("/aircraft", aircraftController.getAircraft);
router.get("/aircraft/:id", aircraftController.getAircraft);
router.get("/aircraft/:id?", aircraftController.getAircraft);
router.post("/aircraft", aircraftController.addAircraft);
router.put("/aircraft/:id", aircraftController.updateAircraftFull);
router.patch("/aircraft/:id", aircraftController.updateAircraft);
router.delete("/aircraft/:id", aircraftController.deleteAircraft);

module.exports = router;
