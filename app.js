const express = require("express");

const app = express();
const port = process.env.PORT || 9000;

// Init routing
const aircraftRoute = require("./src/routes/aircraftRoute");
// const genreRoutes = require("./src/routes/genreRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(movieRoutes);
app.use(aircraftRoute);

// Index endpoint
app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});

module.exports = app;
