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
