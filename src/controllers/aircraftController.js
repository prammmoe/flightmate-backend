const prisma = require("../configs/prismaConfig");

/***
 * @function getAirCraftById
 * Function to get unique aircraft by {id}
 */
const getAirCraftById = async (prisma, aircraftId) => {
  try {
    const aircraft = await prisma.aircraft.findUnique({
      where: {
        id: aircraftId,
      },
      include: {
        flights: true,
      },
    });
    return aircraft;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * @function getAircraftByParams
 * Function to get aircrafts available based on specific params
 */

const getAircraftByParams = async (prisma, query) => {
  const { model, manufacturer, seatingCapacity } = query;

  // Validate the query parameters
  if (!model && !manufacturer && !seatingCapacity) {
    throw new Error("At least one search parameter must be provided");
  }

  const filter = {};
  if (model) filter.model = model;
  if (manufacturer) filter.manufacturer = manufacturer;
  if (seatingCapacity) {
    const capacity = parseInt(seatingCapacity);
    if (isNaN(capacity)) {
      throw new Error("Seating capacity must be a valid number");
    }
    filter.seatingCapacity = seatingCapacity;
  }

  try {
    const aircraft = await prisma.aircraft.findMany({
      where: filter,
      include: {
        flights: true,
      },
    });

    return aircraft;
  } catch (error) {
    console.error("Error retrieving aircrafts: ", error);
    throw error;
  }
};

/***
 * @function getAllAirCrafts
 * Function to get all aircrafts available in the database.
 */

const getAllAirCrafts = async (prisma) => {
  try {
    const aircraft = await prisma.aircraft.findMany({
      include: {
        flights: true,
      },
    });
    return aircraft;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/***
 * @function getAircraft
 * Parent function of getAircraftById, getAircraftByParams & getAllAirCrafts for handle bulk and single request of the aircraft data.
 */

const getAircraft = async (req, res) => {
  const aircraftId = parseInt(req.params.id);
  const query = req.query;
  try {
    if (aircraftId) {
      const aircraft = await getAirCraftById(prisma, aircraftId);
      if (aircraft) {
        res.status(200).send(aircraft);
      } else {
        res.status(404).send({
          message: "Aircraft not found",
        });
      }
    } else if (Object.keys(query).length > 0) {
      try {
        const aircrafts = await getAircraftByParams(prisma, query);
        res.status(200).send(aircrafts);
      } catch (error) {
        res.status(400).send({
          message: error.message,
        });
      }
    } else {
      const aircrafts = await getAllAirCrafts(prisma);
      res.status(200).send(aircrafts);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

/***
 * @function addAircraft
 * Function to add new aircraft data, both single and bulk addition
 */

const addAircraft = async (req, res) => {
  const newAircraftData = req.body;

  try {
    // Bulk addition
    if (Array.isArray(newAircraftData)) {
      const createdAircraft = await prisma.aircraft.createMany({
        data: newAircraftData,
      });
      res.status(200).send({
        data: createdAircraft,
        message: "Success create new aircraft data.",
      });
    } else {
      // Single addition
      const result = await prisma.aircraft.create({
        data: {
          model: newAircraftData.model,
          manufacturer: newAircraftData.manufacturer,
          seatingCapacity: newAircraftData.seatingCapacity,
        },
      });
      res.status(201).send(result);
    }
  } catch (error) {
    console.log("Error adding aircraft: ", error);
    res.status(500).send({
      message: "An error occurred while adding the aircraft",
    });
  }
};

/**
 * @function deleteAircraft
 * Function to delete aircraft, only by using id
 */

const deleteAircraft = async (req, res) => {
  const aircraftId = parseInt(req.params.id);

  try {
    await prisma.aircraft.delete({
      where: {
        id: aircraftId,
      },
    });

    res.status(200).send({
      message: "Aircraft deleted",
    });
  } catch (error) {
    console.error("Error deleting aircraft: ", error);
    if (error.code === "P2025") {
      return res.status(404).send({ error: "Aircraft not found" });
    }
    res.status(500).send({
      error: "An error occurred when deleting the aircraft",
    });
  }
};

/**
 * @function updateAircraft
 * Function to update an existing aircraft by its id.
 */

const updateAircraft = async (req, res) => {
  const aircraftId = parseInt(req.params.id);
  const updateData = req.body;

  try {
    const updatedAircraft = await prisma.aircraft.update({
      where: {
        id: aircraftId,
      },
      data: updateData,
    });

    res.status(200).send(updatedAircraft);
  } catch (error) {
    console.error("Error updating aircraft: ", error);
    if (error.code === "P2025") {
      return res.status(404).send({ error: "Aircraft not found" });
    }
    res.status(500).send({
      error: "An error occurred when updating the aircraft",
    });
  }
};

/**
 * @function updateAircraftFull
 * Function to update an existing resource entirely.
 */

const updateAircraftFull = async (req, res) => {
  const aircraftId = parseInt(req.params.id);
  const { model, manufacturer, seatingCapacity } = req.body;

  if (!model || !manufacturer || typeof seatingCapacity !== "number") {
    return res.status(400).send({
      error: "Invalid input",
    });
  }

  try {
    const updatedAircraft = await prisma.aircraft.update({
      where: {
        id: aircraftId,
      },
      data: {
        model,
        manufacturer,
        seatingCapacity,
      },
    });
    res.status(200).send(updatedAircraft);
  } catch (error) {
    console.error("Error updating aircraft: ", error);
    if (error.code === "P2025") {
      return res.status(404).send({ error: "Aircraft not found" });
    }
    res.status(500).send({
      error: "An error occurred when updating the aircraft",
    });
  }
};

/**
 * @module
 * exports all the function
 */
module.exports = {
  getAirCraftById,
  getAircraftByParams,
  getAircraft,
  getAllAirCrafts,
  addAircraft,
  deleteAircraft,
  updateAircraft,
  updateAircraftFull,
};
