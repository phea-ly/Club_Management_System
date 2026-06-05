const dashboardService = require("../services/DashboardService");

class DashboardController {
  getStatistics(req, res) {
    res.json({
      success: true,
      data: dashboardService.getStatistics(),
    });
  }
}

module.exports = new DashboardController();
