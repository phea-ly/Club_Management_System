const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const errorMiddleware = require("./core/middlewares/errorMiddleware");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Club Management System API" });
});

app.use("/api/users", userRoutes);

app.use(errorMiddleware);

module.exports = app;
