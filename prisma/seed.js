const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Seed Users
    const users = await prisma.user.createMany({
      data: [
        {
          name: "Admin User",
          email: "admin@example.com",
          phoneNo: "6281247016022",
          password: "adminpassword",
        },
        {
          name: "Customer User",
          email: "customer@example.com",
          phoneNo: "6281247016022",
          password: "customerpassword",
        },
        {
          name: "Staff User",
          email: "staff@example.com",
          phoneNo: "6281247016022",
          password: "staffpassword",
        },
      ],
    });

    // Seed Passengers
    const passengers = await prisma.passenger.createMany({
      data: [
        {
          firstName: "John",
          lastName: "Cena",
          dateOfBirth: new Date("1990-01-01"),
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          dateOfBirth: new Date("1985-05-15"),
        },
        {
          firstName: "Alice",
          lastName: "Johnson",
          dateOfBirth: new Date("1978-11-23"),
        },
      ],
    });

    // Seed Airports
    const airports = await prisma.airport.createMany({
      data: [
        {
          name: "John F. Kennedy International Airport",
          city: "New York",
          country: "USA",
          iataCode: "JFK",
          icaoCode: "KJFK",
        },
        {
          name: "Los Angeles International Airport",
          city: "Los Angeles",
          country: "USA",
          iataCode: "LAX",
          icaoCode: "KLAX",
        },
        {
          name: "Heathrow Airport",
          city: "London",
          country: "UK",
          iataCode: "LHR",
          icaoCode: "EGLL",
        },
      ],
    });

    // Seed Aircraft
    const aircraft = await prisma.aircraft.createMany({
      data: [
        {
          model: "Boeing 747",
          manufacturer: "Boeing",
          seatingCapacity: 416,
        },
        {
          model: "Airbus A320",
          manufacturer: "Airbus",
          seatingCapacity: 180,
        },
        {
          model: "Boeing 777",
          manufacturer: "Boeing",
          seatingCapacity: 396,
        },
      ],
    });

    // Seed Flights
    const flights = await prisma.flight.createMany({
      data: [
        {
          flightNumber: "AA100",
          flightClass: "Economy",
          departureAirportId: { connect: { id: 1 } }, // JFK
          arrivalAirportId: { connect: { id: 2 } }, // LAX
          departureTime: new Date("2023-06-01T10:00:00.000Z"),
          arrivalTime: new Date("2023-06-01T14:00:00.000Z"),
          aircraftId: { connect: { id: 1 } }, // Boeing 747
          status: "SCHEDULED",
          airlines: "American Airlines",
          ticketPrice: 300,
        },
        {
          flightNumber: "BA200",
          flightClass: "Economy",
          departureAirportId: { connect: { id: 2 } }, // LAX
          arrivalAirportId: { connect: { id: 3 } }, // LHR
          departureTime: new Date("2023-06-02T15:00:00.000Z"),
          arrivalTime: new Date("2023-06-02T23:00:00.000Z"),
          aircraftId: { connect: { id: 2 } }, // Airbus A320
          status: "ON_TIME",
          airlines: "British Airways",
          ticketPrice: 400,
        },
        {
          flightNumber: "DL300",
          flightClass: "Economy",
          departureAirportId: { connect: { id: 3 } }, // LHR
          arrivalAirportId: { connect: { id: 1 } }, // JFK
          departureTime: new Date("2023-06-03T08:00:00.000Z"),
          arrivalTime: new Date("2023-06-03T16:00:00.000Z"),
          aircraftId: { connect: { id: 3 } }, // Boeing 777
          status: "DELAYED",
          airlines: "Delta Airlines",
          ticketPrice: 500,
        },
      ],
    });

    // Seed Bookings
    const bookings = await prisma.booking.createMany({
      data: [
        {
          userId: { connect: { id: 2 } }, // Customer User
          passengerId: { connect: { id: 1 } }, // John Cena
          flightId: { connect: { id: 1 } }, // AA100
          bookingDate: new Date(),
          status: "CONFIRMED",
          seatNumber: "12A",
          luggageWeight: 20,
        },
        {
          userId: { connect: { id: 2 } }, // Customer User
          passengerId: { connect: { id: 2 } }, // Jane Smith
          flightId: { connect: { id: 2 } }, // BA200
          bookingDate: new Date(),
          status: "CONFIRMED",
          seatNumber: "14B",
          luggageWeight: 20,
        },
        {
          userId: { connect: { id: 2 } }, // Customer User
          passengerId: { connect: { id: 3 } }, // Alice Johnson
          flightId: { connect: { id: 3 } }, // DL300
          bookingDate: new Date(),
          status: "CONFIRMED",
          seatNumber: "16C",
          luggageWeight: 20,
        },
      ],
    });

    // Seed Payments
    const payments = await prisma.payment.createMany({
      data: [
        {
          paymentCode: 1,
          bookingId: 1,
          productName: "Flight Ticket",
          amount: 300,
          quantity: 1,
          paymentDate: new Date(),
        },
        {
          paymentCode: 2,
          bookingId: 2,
          productName: "Flight Ticket",
          amount: 400,
          quantity: 1,
          paymentDate: new Date(),
        },
        {
          paymentCode: 3,
          bookingId: 3,
          productName: "Flight Ticket",
          amount: 500,
          quantity: 1,
          paymentDate: new Date(),
        },
      ],
    });

    console.log({
      users,
      passengers,
      airports,
      aircraft,
      flights,
      bookings,
      payments,
    });
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
