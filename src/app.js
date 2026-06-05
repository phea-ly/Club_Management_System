const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const clubRoutes = require("./routes/clubRoutes");
const clubListPage = require("./views/clubs/club_list");
const errorMiddleware = require("./core/middlewares/errorMiddleware");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Club Management System API" });
});

app.get("/clubs", (req, res) => {
  res.send(clubListPage());
});

app.use("/api/users", userRoutes);
app.use("/api/clubs", clubRoutes);

app.use(errorMiddleware);

module.exports = app;
