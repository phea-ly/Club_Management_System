const express = require("express");
const attendanceController = require("../controllers/AttendanceController");
const { allowRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();
const allowAttendance = allowRoles("ADMIN", "LEADER");

router.get("/", allowAttendance, attendanceController.getAttendanceHistory);
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
