const express = require("express");
const logger = require("morgan");

const app = express();
const port = process.env.PORT || 9000;
const cors = require("cors");

/**
 * @package Cors
 */

const corsBaseUrl = "http://localhost:3000";

app.use(
  cors({
    origin: corsBaseUrl,
    optionsSuccessStatus: 200,
  })
);

/**
 * @module Swagger
 */

const swaggerUI = require("swagger-ui-express");
const apiDocs = require("./apidocs.json");
app.use("/apidocs", swaggerUI.serve, swaggerUI.setup(apiDocs));

// Init routing
const aircraftRoute = require("./src/routes/aircraftRoute");
const airportRoute = require("./src/routes/airportRoute");
const flightRoute = require("./src/routes/flightRoute");
const bookingRoute = require("./src/routes/bookingRoute");

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(aircraftRoute);
app.use(airportRoute);
app.use(flightRoute);
app.use(bookingRoute);

// Index endpoint
app.get("/", (req, res) => {
  res.send("Pace bekasi daboy!");
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});

module.exports = app;
