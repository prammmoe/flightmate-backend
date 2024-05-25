const prisma = require("../configs/prismaConfig");

/**
 * @function addFlight
 * Function to add new Flight data, both single and bulk addition
 */

const addFlight = async (req, res) => {
  const newFlightData = req.body;

  if (!newFlightData) {
    return res.status(400).send({
      error: "No flight data provided",
    });
  }

  try {
    if (Array.isArray(newFlightData)) {
      const createdFlights = await prisma.flight.createMany({
        data: newFlightData,
        skipDuplicates: true, // Skip if the flight number already exists
      });
      res.status(200).send({
        data: createdFlights,
        message: "Success create new flight data.",
      });
    } else {
      const result = await prisma.flight.create({
        data: {
          flightNumber: newFlightData.flightNumber,
          departureAirportId: newFlightData.departureAirportId,
          arrivalAirportId: newFlightData.arrivalAirportId,
          departureTime: new Date(newFlightData.departureTime),
          arrivalTime: new Date(newFlightData.arrivalTime),
          aircraftId: newFlightData.aircraftId,
          status: newFlightData.status,
        },
      });
      res.status(201).send(result);
    }
  } catch (error) {
    console.error("Error adding flight: ", error);
    res.status(500).send({
      message: "An error occurred while adding the flight",
    });
  }
};

/**
 * @function getFlightById
 * Function to get flight by its id
 */

const getFlightById = async (prisma, flightId) => {
  try {
    const flight = await prisma.flight.findUnique({
      where: {
        id: flightId,
      },
      include: {
        aircraft: true,
        departureAirport: true,
        arrivalAirport: true,
      },
    });

    return flight;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * @function getAllFlights
 * Function to get all flights available in the database
 */

const getAllFlights = async (prisma) => {
  try {
    const result = await prisma.flight.findMany({
      include: {
        aircraft: true,
        departureAirport: true,
        arrivalAirport: true,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * @function getFlight
 * Parent function of getFlightById, getAllFlights for handle bulk and single request of the flight data.
 */

const getFlight = async (req, res) => {
  const flightId = parseInt(req.params.id);
  try {
    if (flightId) {
      const flight = await getFlightById(prisma, flightId);
      if (flight) {
        res.status(200).send(flight);
      } else {
        res.status(404).send({
          error: "Flight not found",
        });
      }
    } else {
      const flights = await getAllFlights(prisma);
      res.status(200).send(flights);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};

/**
 * @function updateFlight
 * Function to update a flight by its ID.
 */

const updateFlight = async (req, res) => {
  const flightId = parseInt(req.params.id);
  const updateData = req.body;

  if (!flightId) {
    return res.status(400).send({
      error: "Flight ID is required",
    });
  }

  try {
    const updatedFlight = await prisma.flight.update({
      where: {
        id: flightId,
      },
      data: updateData,
    });

    res.status(200).send(updatedFlight);
  } catch (error) {
    console.error("Error updating flight: ", error);
    if (error.code === "P2025") {
      return res.status(404).send({ error: "Flight not found" });
    }
    res.status(500).send({
      error: "An error occurred when updating the flight",
    });
  }
};

/**
 * @function updateFlightFull
 * Function to update an existing flight resource entirely.
 */

const updateFlightFull = async (req, res) => {
  const airportId = parseInt(req.params.id);
  const {
    flightNumber,
    departureAirportId,
    arrivalAirportId,
    departureTime,
    arrivalTime,
    aircraftId,
    status,
  } = req.body;

  if (
    !flightNumber ||
    !departureAirportId ||
    !arrivalAirportId ||
    !departureTime ||
    !arrivalTime ||
    !aircraftId ||
    !status
  ) {
    return res.status(400).send({
      error: "Invalid input",
    });
  }

  try {
    const updatedFlight = await prisma.flight.update({
      where: {
        id: flightId,
      },
      data: {
        flightNumber,
        departureAirportId,
        arrivalAirportId,
        departureTime,
        arrivalTime,
        aircraftId,
        status,
      },
    });

    res.status(200).send(updatedFlight);
  } catch (error) {
    console.error("Error updating flight: ", error);
    if (error.code === "P2025") {
      return res.status(404).send({ error: "Flight not found" });
    }
    res.status(500).send({
      error: "An error occurred when updating the flight",
    });
  }
};

/**
 * @function deleteFlight
 * Function to delete flight only by using its id.
 */

const deleteFlight = async (req, res) => {
  const flightId = parseInt(req.params.id);

  try {
    await prisma.flight.delete({
      where: {
        id: flightId,
      },
    });

    res.status(200).send({
      message: "Flight deleted",
    });
  } catch (error) {
    console.error("Error deleting flight: ", error);
    if (error.code === "P2025") {
      return res.status(404).send({ error: "Flight not found" });
    }
    res.status(500).send({
      error: "An error occurred when deleting the flight",
    });
  }
};

/**
 * @function searchFlights
 * Function to search for flights based on query parameters
 */

const searchFlights = async (req, res) => {
  const { departureCity, arrivalCity, travelDate } = req.query;

  if (!departureCity || !arrivalCity || !travelDate) {
    return res.status(400).send({
      error: "please input needed data",
    });
  }

  try {
    const flights = await prisma.flight.findMany({
      where: {
        departureTime: {
          // Filters for flights departing from the day from 00:00:00 to 23:59:59 (UTC time).
          gte: new Date(`${travelDate}T00:00:00Z`),
          lt: new Date(`${travelDate}T23:59:59Z`),
        },
        departureAirport: {
          city: departureCity,
        },
        arrivalAirport: {
          city: arrivalCity,
        },
      },
      include: {
        aircraft: true,
        departureAirport: true,
        arrivalAirport: true,
      },
    });

    if (flights.length === 0) {
      return res.status(400).send({
        message: "No flights found",
      });
    }

    res.status(200).send(flights);
  } catch (error) {
    console.error("Error searching for flights: ", error);
    res.status(500).send({
      message: "An error occurred while searching for flights",
    });
  }
};

/**
 * @module
 * Exports all the function
 */

module.exports = {
  getFlightById,
  getAllFlights,
  getFlight,
  addFlight,
  deleteFlight,
  updateFlight,
  updateFlightFull,
  searchFlights,
};
