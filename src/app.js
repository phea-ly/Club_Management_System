require("dotenv").config();

const express = require("express");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));

const sendView = (res, fileName) => {
    res.sendFile(path.join(__dirname, "views", fileName));
};

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    sendView(res, "auth/login.html");
});

app.get("/register", (req, res) => {
    sendView(res, "auth/register.html");
});

app.get("/users", (req, res) => {
    sendView(res, "users.html");
});

app.get("/admin", (req, res) => {
    sendView(res, "admin.html");
});

app.get("/leader", (req, res) => {
    sendView(res, "leader.html");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
