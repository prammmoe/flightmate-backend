const prisma = require("../../configs/prismaConfig");

/**
 * @function createBooking
 * Function to create new booking
 */

const createBooking = async (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    dateOfBirth,
    flightId,
    status,
    luggageWeight,
  } = req.body;

  // Get the user ID from the request object (set by the verifyToken middleware)

  try {
    const newPassenger = await prisma.passenger.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
      },
    });

    const newBooking = await prisma.booking.create({
      data: {
        userId: userId,
        passengerId: newPassenger.id,
        flightId,
        bookingDate: new Date(),
        status,
        luggageWeight,
      },
      include: {
        user: true,
        passenger: true,
        flight: true,
      },
    });

    res.status(201).send({
      message: "Success create booking",
      data: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking: ", error);
    res.status(500).send({
      message: "An error occurred while creating the booking",
    });
  }
};

/**
 * @function getBookingById
 * Function to get booking by its id
 */

const getBookingById = async (prisma, bookingId) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        passenger: true,
        flight: true,
        payment: true,
      },
    });

    if (booking) {
      return booking;
    } else {
      return "Booking not found";
    }
  } catch (error) {
    console.error("Error getting booking: ", error);
    throw error;
  }
};

/**
 * @function getAllBookings
 * Function to get all bookings available in the database.
 */

const getAllBookings = async (prisma) => {
  try {
    const result = await prisma.booking.findMany({
      include: {
        passenger: true,
        flight: true,
        payment: true,
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * @function getBooking
 * Parent function of getBookingById and getAllBookings for handle bulk and single request of the flight data.
 */

const getBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id);
  try {
    if (bookingId) {
      const booking = await getBookingById(prisma, bookingId);
      if (booking) {
        res.status(200).send(booking);
      } else {
        res.status(404).send({
          error: "Booking not found",
        });
      }
    } else {
      const bookings = await getAllBookings(prisma);
      res.status(200).send(bookings);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};

/**
 * @function updateBooking
 * Function to update a booking by its ID.
 */

const updateBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id);
  const updateData = req.body;

  if (!bookingId) {
    return res.status(400).send({
      error: "Booking ID is required",
    });
  }

  try {
    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: updateData,
    });

    res.status(200).send(updatedBooking);
  } catch (error) {
    console.error("Error updating booking: ", error);
    if (error.code === "P2025") {
      return res.status(404).send({ error: "Booking not found" });
    }
    res.status(500).send({
      error: "An error occurred when updating the booking",
    });
  }
};

/**
 * @function updateBookingFull
 * Function to update an existing booking resource entirely.
 */

const updateBookingFull = async (req, res) => {
  const bookingId = parseInt(req.params.id);
  const { bookingDate, status, seatNumber, payment } = req.body;

  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        bookingDate,
        status,
        seatNumber,
        payment: payment
          ? {
              update: payment,
            }
          : undefined,
      },
      include: {
        passenger: true,
        flight: true,
        payment: true,
      },
    });

    res.status(200).send(updatedBooking);
  } catch (error) {
    console.error("Error updating booking: ", error);
    if (error.code === "P2025") {
      return res.status(404).send({ error: "Booking not found" });
    }
    res.status(500).send({
      error: "An error occurred when updating the booking",
    });
  }
};

/**
 * @function deleteBooking
 * Function to delete booking by its ID.
 */

const deleteBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id);

  try {
    await prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });

    res.status(200).send({
      message: "Booking deleted",
    });
  } catch (error) {
    console.error("Error deleting booking: ", error);
    res.status(500).send({
      message: "An error occurred while deleting the booking",
    });
  }
};

/**
 * @module
 * Exports all the function
 */

module.exports = {
  getBookingById,
  getAllBookings,
  getBooking,
  createBooking,
  deleteBooking,
  updateBooking,
  updateBookingFull,
};
