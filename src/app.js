const express = require("express");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const clubRoutes = require("./routes/clubRoutes");
const userRepository = require("./repositories/UserRepository");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Club Management API is running",
  });
});

app.use("/users", userRoutes);
app.use("/profile", profileRoutes);
app.use("/clubs", clubRoutes);
app.use("/attendance", attendanceRoutes);

app.use((req, res) => {
    res.status(404).send("<h1>404</h1><p>Page not found</p><a href='/users'>Back to users</a>");
});

async function bootstrap() {
    await userRepository.initialize();
    return app;
}

module.exports = app;
module.exports.bootstrap = bootstrap;
