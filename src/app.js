const express = require("express");
const dotenv = require("dotenv");
const memberRoutes = require("./routes/memberRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const userManagementPage = require("./views/users/user_management");
const errorMiddleware = require("./core/middlewares/errorMiddleware");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Club Management System API" });
});

app.get("/users", (req, res) => {
  res.send(userManagementPage());
});

app.use("/api/users", userRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/events", eventRoutes);

app.use(errorMiddleware);

module.exports = app;
