const prisma = require("../controllers/airportController");

const getAirportById = async (prisma, airportId) => {
  try {
    const airport = await prisma.airport.findUnique({
      where: {
        id: airportId,
      },
      include: {
        departures: true,
        arrivals: true,
      },
    });
    return airport;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { getAirportById };
