const dashboardService = require("../services/DashboardService");

class DashboardController {
  async getStatistics(req, res) {
    try {
      res.json({
        success: true,
        data: await dashboardService.getStatistics(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new DashboardController();
