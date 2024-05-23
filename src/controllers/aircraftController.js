const prisma = require("../configs/prismaConfig");

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

const getAircraft = async (req, res) => {
  const aircraftId = parseInt(req.params.id);
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

const addAircraft = async (req, res) => {
  const newAircraftData = req.body;

  try {
    if (Array.isArray(newAircraftData)) {
      const createdAircraft = await prisma.aircraft.createMany({
        data: newAircraftData,
      });
      res.status(200).send({
        data: createdAircraft,
        message: "Success create new aircraft data.",
      });
    } else {
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
  } finally {
    prisma.$disconnect;
  }
};

module.exports = { getAirCraftById, getAircraft, getAllAirCrafts, addAircraft };
