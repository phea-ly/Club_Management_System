const dashboardService = require("../services/DashboardService");

const sendSuccess = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

class DashboardController {
  getStatistics(req, res) {
    const statistics = dashboardService.getStatistics(req.query);
    sendSuccess(res, 200, statistics, "Dashboard statistics retrieved successfully");
  }

  getActivityReports(req, res) {
    const reports = dashboardService.getActivityReports(req.query);
    sendSuccess(res, 200, reports, "Club activity reports retrieved successfully");
  }
}

module.exports = new DashboardController();
