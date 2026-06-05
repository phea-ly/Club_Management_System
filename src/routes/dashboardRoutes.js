const express = require("express");
const dashboardController = require("../controllers/DashboardController");

const router = express.Router();

router.get("/statistics", dashboardController.getStatistics);

module.exports = router;
