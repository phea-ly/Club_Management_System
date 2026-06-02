const express = require("express");
const clubRoutes = require("./routes/clubRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const renderClubListPage = require("./views/clubs/club_list");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/club-management");
});

app.get("/club-management", (req, res) => {
  res.send(renderClubListPage());
});

app.use("/clubs", clubRoutes);
app.use("/attendance", attendanceRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
