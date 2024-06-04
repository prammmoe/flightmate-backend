const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const router = require("./src/routes");

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

// Swagger configs
const swaggerUI = require("swagger-ui-express");
const apiDocs = require("./apidocs.json");
app.use("/apidocs", swaggerUI.serve, swaggerUI.setup(apiDocs));

app.use(cookieParser());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

app.get("/", (req, res) => {
  res.send("Welcome to FlightMate API!");
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});

module.exports = app;
