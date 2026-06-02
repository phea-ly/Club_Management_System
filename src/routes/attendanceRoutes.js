const express = require("express");
const attendanceController = require("../controllers/AttendanceController");

const router = express.Router();

const allowRoles = (...roles) => {
  return (req, res, next) => {
    const role = req.headers["x-user-role"];

    if (!roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `Only ${roles.join(" or ")} can access this action`,
      });
    }

    next();
  };
};

router.get(
  "/",
  allowRoles("admin", "leader"),
  attendanceController.getAttendanceHistory
);
router.get(
  "/reports",
  allowRoles("admin", "leader"),
  attendanceController.getReport
);
router.get(
  "/students/:studentKey",
  allowRoles("admin", "leader"),
  attendanceController.getStudentHistory
);
router.get(
  "/:id",
  allowRoles("admin", "leader"),
  attendanceController.getAttendanceById
);
router.post(
  "/",
  allowRoles("admin", "leader"),
  attendanceController.recordAttendance
);

module.exports = router;
