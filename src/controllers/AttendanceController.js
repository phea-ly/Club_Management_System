const attendanceService = require("../services/AttendanceService");

const sendSuccess = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

const getErrorStatus = (error) => {
  return error.message.includes("not found") ? 404 : 400;
};

class AttendanceController {
  getAttendanceHistory(req, res) {
    const history = attendanceService.getAttendanceHistory(req.query);
    sendSuccess(res, 200, history, "Attendance history retrieved successfully");
  }

  getAttendanceById(req, res) {
    try {
      const attendance = attendanceService.getAttendanceById(req.params.id);
      sendSuccess(res, 200, attendance, "Attendance record retrieved successfully");
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }

  recordAttendance(req, res) {
    try {
      const attendance = attendanceService.recordAttendance(req.body);
      sendSuccess(res, 201, attendance, "Attendance recorded successfully");
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }

  getStudentHistory(req, res) {
    try {
      const history = attendanceService.getStudentHistory(req.params.studentKey);
      sendSuccess(res, 200, history, "Student attendance history retrieved successfully");
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }

  getReport(req, res) {
    const report = attendanceService.getReport(req.query);
    sendSuccess(res, 200, report, "Attendance report generated successfully");
  }
}

module.exports = new AttendanceController();
