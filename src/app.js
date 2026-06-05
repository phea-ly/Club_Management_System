const express = require("express");
const clubRoutes = require("./routes/clubRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Club Management API is running",
  });
});

app.use("/clubs", clubRoutes);
app.use("/attendance", attendanceRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
