const express = require("express");
const attendanceController = require("../controllers/AttendanceController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(requireAuth, requireRoles("admin", "club_leader"));

router.get("/", attendanceController.getAttendanceHistory);
router.get("/reports", attendanceController.getReport);
router.get("/students/:studentKey", attendanceController.getStudentHistory);
router.get("/:id", attendanceController.getAttendanceById);
router.post("/", attendanceController.recordAttendance);

module.exports = router;
