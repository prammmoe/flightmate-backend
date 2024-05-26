const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 9000;

const corsBaseUrl = "http://localhost:3000";
const tunnelUrl = "https://hp5znbh8-9000.asse.devtunnels.ms";

app.use(
  cors({
    origin: [corsBaseUrl, tunnelUrl], // Allow both localhost and tunnel URL
    optionsSuccessStatus: 200,
  })
);

const swaggerUI = require("swagger-ui-express");
const apiDocs = require("./apidocs.json");
app.use("/apidocs", swaggerUI.serve, swaggerUI.setup(apiDocs));

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const aircraftRoute = require("./src/routes/aircraftRoute");
const airportRoute = require("./src/routes/airportRoute");
const flightRoute = require("./src/routes/flightRoute");
const bookingRoute = require("./src/routes/bookingRoute");

app.use(aircraftRoute);
app.use(airportRoute);
app.use(flightRoute);
app.use(bookingRoute);

app.get("/", (req, res) => {
  res.send("Pace bekasi daboy!");
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});

module.exports = app;
