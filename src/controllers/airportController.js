const prisma = require("../configs/prismaConfig");

/**
 * @function
 * Function to get unique airport by {id}
 */
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

/**
 * @function getAirportByParams
 * Function to get airports available based on specific params
 */
const getAirportByParams = async (prisma, query) => {
  const { name, city, country, iataCode, icaoCode } = query;

  // Validate the query parameters
  if (!name && !city && !country && !iataCode && !icaoCode) {
    throw new Error("At least one search parameter must be provided");
  }

  const filter = {};
  if (name) filter.name = name;
  if (city) filter.city = city;
  if (country) filter.country = country;
  if (iataCode) filter.iataCode = iataCode;
  if (icaoCode) filter.icaoCode = icaoCode;

  try {
    const airport = await prisma.airport.findMany({
      where: filter,
      include: {
        departures: true,
        arrivals: true,
      },
    });

    return airport;
  } catch (error) {
    console.error("Error retrieving airport: ", error);
    throw error;
  }
};

/**
 * @function getAllAirports
 * Function to get all airports available in the database.
 */

const getAllAirports = async (prisma) => {
  try {
    const airport = await prisma.airport.findMany({
      include: {
        departures: true,
        arrivals: true,
      },
    });

    return airport;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * @function getAirport
 * Parent function of getAirportById, getAirportByParams & getAllAirports for handle bulk and single request of the airport data.
 */

const getAirport = async (req, res) => {
  const airportId = parseInt(req.params.id);
  const query = req.query;
  try {
    if (airportId) {
      const airport = await getAirportById(prisma, airportId);
      if (airport) {
        res.status(200).send(airport);
      } else {
        res.status(404).send({
          error: "Airport not found",
        });
      }
    } else if (Object.keys(query).length > 0) {
      try {
        const airports = await getAirportByParams(prisma, query);
        res.status(200).send(airports);
      } catch (error) {
        res.status(404).send({
          message: error.message,
        });
      }
    } else {
      const airports = await getAllAirports(prisma);
      res.status(200).send(airports);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};

/**
 * @function addAirport
 * Function to add new airport data, both single and bulk addition
 */

const addAirport = async (req, res) => {
  const newAirportData = req.body;

  // Validate input
  // if (
  //   !newAirportData.name ||
  //   !newAirportData.city ||
  //   !newAirportData.country ||
  //   typeof newAirportData.iataCode !== "string" ||
  //   typeof newAirportData.icaoCode !== "string"
  // ) {
  //   return res.status(400).send({ error: "Invalid input" });
  // }

  try {
    // Handle bulk addition
    if (Array.isArray(newAirportData)) {
      const createdAirport = await prisma.airport.createMany({
        data: newAirportData,
      });
      res.status(200).send({
        data: createdAirport,
        message: "Success create new airport data",
      });
    } else {
      // Handle single addition
      const result = await prisma.airport.create({
        data: {
          name: newAirportData.name,
          city: newAirportData.city,
          country: newAirportData.country,
          icaoCode: newAirportData.icaoCode,
          iataCode: newAirportData.iataCode,
        },
      });
      res.status(201).send(result);
    }
  } catch (error) {
    console.log("Error adding airport: ", error);
    res.status(500).send({
      message: "An error occurred while adding the airport",
    });
  }
};

/**
 * @function deleteAirport
 * Function to delete airport, only by using id
 */

const deleteAirport = async (req, res) => {
  const airportId = parseInt(req.params.id);

  try {
    await prisma.airport.delete({
      where: {
        id: airportId,
      },
    });

    res.status(200).send({
      message: "Airport deleted",
    });
  } catch (error) {
    console.error("Error deleting airport: ", error);
    if (error.code === "P2025") {
      return res.status(404).send({ error: "Airport not found" });
    }
    res.status(500).send({
      error: "An error occurred when deleting the airport",
    });
  }
};

/**
 * @function updateAirport
 * Function to update an existing airport by its id.
 */

const updateAirport = async (req, res) => {
  const airportId = parseInt(req.params.id);
  const updateData = req.body;

  try {
    const updatedAirport = await prisma.airport.update({
      where: {
        id: airportId,
      },
      data: updateData,
    });

    res.status(200).send(updatedAirport);
  } catch (error) {
    console.error("Error updating airport: ", error);
    if (error.code === "P2025") {
      return res.status(404).send({ error: "Airport not found" });
    }
    res.status(500).send({
      error: "An error occurred when updating the airport",
    });
  }
};

/**
 * @function updateAirportFull
 * Function to update an existing resource entirely.
 */

const updateAirportFull = async (req, res) => {
  const airportId = parseInt(req.params.id);
  const { name, city, country, iataCode, icaoCode } = req.body;

  if (
    !name ||
    !city ||
    !country ||
    typeof iataCode !== "string" ||
    typeof icaoCode !== "string"
  ) {
    return res.status(400).send({
      error: "Invalid input",
    });
  }

  try {
    const updatedAirport = await prisma.airport.update({
      where: {
        id: airportId,
      },
      data: {
        name,
        city,
        country,
        iataCode,
        icaoCode,
      },
    });

    res.status(200).send(updatedAirport);
  } catch (error) {
    console.error("Error updating airport: ", error);
    if (error.code === "P2025") {
      return res.status(404).send({ error: "Airport not found" });
    }
    res.status(500).send({
      error: "An error occurred when updating the airport",
    });
  }
};

/**
 * @module
 * exports all the function
 */
module.exports = {
  getAirportById,
  getAirportByParams,
  getAirport,
  getAllAirports,
  addAirport,
  deleteAirport,
  updateAirport,
  updateAirportFull,
};
