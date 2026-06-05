const express = require("express");
const dashboardController = require("../controllers/DashboardController");
const { allowRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();
const allowReports = allowRoles("ADMIN", "LEADER");

router.get("/statistics", allowReports, dashboardController.getStatistics);
router.get("/reports/club-activity", allowReports, dashboardController.getActivityReports);

module.exports = router;
