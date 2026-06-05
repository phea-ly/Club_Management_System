const express = require("express");
const clubRoutes = require("./routes/clubRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Club Management System API",
    routes: {
      clubs: "/clubs",
      dashboard: "/dashboard/statistics",
      attendance: "/attendance",
    },
  });
});

app.use("/clubs", clubRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/attendance", attendanceRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
