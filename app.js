const express = require("express");
const logger = require("morgan");

const app = express();
const port = process.env.PORT || 9000;

// Init routing
const aircraftRoute = require("./src/routes/aircraftRoute");
const airportRoute = require("./src/routes/airportRoute");
const flightRoute = require("./src/routes/flightRoute");

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(aircraftRoute);
app.use(airportRoute);
app.use(flightRoute);

// Index endpoint
app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});

module.exports = app;
