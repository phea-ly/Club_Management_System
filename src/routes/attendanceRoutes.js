const express = require("express");
const attendanceController = require("../controllers/AttendanceController");
const { allowRoles } = require("../middlewares/roleMiddleware");
const renderAttendancePage = require("../views/attendance/attendance");

const router = express.Router();
const allowAttendance = allowRoles("ADMIN", "LEADER");

router.get(
  "/",
  allowAttendance,
  (req, res, next) => {
    if (req.accepts("html") && !req.accepts("json")) {
      res.send(renderAttendancePage());
      return;
    }

    next();
  },
  attendanceController.getAttendanceHistory
);
router.get(
  "/history",
  allowAttendance,
  attendanceController.getAttendanceHistory
);
router.get(
  "/reports",
  allowAttendance,
  attendanceController.getReport
);
router.get(
  "/students/:studentKey",
  allowAttendance,
  attendanceController.getStudentHistory
);
router.get(
  "/:id",
  allowAttendance,
  attendanceController.getAttendanceById
);
router.post(
  "/",
  allowAttendance,
  attendanceController.recordAttendance
);

module.exports = router;
