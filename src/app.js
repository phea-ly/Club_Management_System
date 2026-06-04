const express = require("express");
require("./services/AuthService");
const authRoutes = require("./routes/authRoutes");
const clubRoutes = require("./routes/clubRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const { attachUser } = require("./middlewares/authMiddleware");
const renderDashboardPage = require("./views/dashboard/dashboard");
const renderClubListPage = require("./views/clubs/club_list");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(attachUser);
app.use(authRoutes);

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
  res.send(renderDashboardPage());
});

app.get("/club-management", (req, res) => {
  res.send(renderClubListPage());
});

app.use("/clubs", clubRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/users", userRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
