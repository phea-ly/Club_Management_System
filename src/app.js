require("dotenv").config();

const express = require("express");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.redirect("/search");
});

app.use("/search", searchRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Something went wrong while searching. Please try again later.");
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Club Management System running at http://localhost:${port}`);
    });
}

module.exports = app;
