const express = require("express");
const attendanceController = require("../controllers/AttendanceController");

const router = express.Router();

router.get("/", attendanceController.getAttendance);
router.post("/", attendanceController.recordAttendance);
router.get("/reports", attendanceController.getReport);

module.exports = router;
