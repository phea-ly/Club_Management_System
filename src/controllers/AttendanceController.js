const attendanceService = require("../services/AttendanceService");

class AttendanceController {
  getAttendance(req, res) {
    res.json({
      success: true,
      data: attendanceService.getAttendance(),
    });
  }

  recordAttendance(req, res) {
    try {
      res.status(201).json({
        success: true,
        data: attendanceService.recordAttendance(req.body),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  getReport(req, res) {
    res.json({
      success: true,
      data: attendanceService.getReport(),
    });
  }
}

module.exports = new AttendanceController();
