const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

const corsBaseUrl = "http://localhost:3000";
const tunnelUrl = "https://hp5znbh8-9000.asse.devtunnels.ms/";

app.use(
  cors({
    origin: [corsBaseUrl, tunnelUrl], // Allow both localhost and tunnel URL
    optionsSuccessStatus: 200,
  })
);

const swaggerUI = require("swagger-ui-express");
const apiDocs = require("./apidocs.json");
app.use("/apidocs", swaggerUI.serve, swaggerUI.setup(apiDocs));

app.use(cookieParser());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const aircraftRoute = require("./src/routes/aircraftRoute");
const airportRoute = require("./src/routes/airportRoute");
const flightRoute = require("./src/routes/flightRoute");
const bookingRoute = require("./src/routes/bookingRoute");
const userRoute = require("./src/routes/userRoute");
const paymentRoute = require("./src/routes/paymentRoute");

app.use(aircraftRoute);
app.use(airportRoute);
app.use(flightRoute);
app.use(bookingRoute);
app.use(userRoute);
app.use(paymentRoute);

app.get("/", (req, res) => {
  res.send("FlightMate API!");
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});

module.exports = app;
