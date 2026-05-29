const express = require("express");
const env = require("./config/env");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Club Management System API"
    });
});

app.use("/events", eventRoutes);
app.use("/api/events", eventRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

if (require.main === module) {
    const port = env.port || 5000;

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;
