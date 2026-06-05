const express = require("express");
const dotenv = require("dotenv");
const memberRoutes = require("./routes/memberRoutes");
const eventRoutes = require("./routes/eventRoutes");
const memberManagementPage = require("./views/members/member_management");
const errorMiddleware = require("./core/middlewares/errorMiddleware");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Club Management System API" });
});

app.get("/members", (req, res) => {
  res.send(memberManagementPage());
});

app.use("/api/members", memberRoutes);
app.use("/api/events", eventRoutes);

app.use(errorMiddleware);

module.exports = app;
