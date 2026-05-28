const express = require("express");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRepository = require("./repositories/UserRepository");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.redirect("/users");
});

app.use("/users", userRoutes);
app.use("/profile", profileRoutes);

app.use((req, res) => {
    res.status(404).send("<h1>404</h1><p>Page not found</p><a href='/users'>Back to users</a>");
});

async function bootstrap() {
    await userRepository.initialize();
    return app;
}

module.exports = app;
module.exports.bootstrap = bootstrap;
