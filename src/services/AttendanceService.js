const attendanceRepository = require("../repositories/AttendanceRepository");

const VALID_STATUSES = ["present", "late", "absent"];

class AttendanceService {
  getAttendance() {
    return attendanceRepository.findAll();
  }

  recordAttendance(data = {}) {
    if (!data.clubId || !data.studentName || !data.status) {
      throw new Error("clubId, studentName, and status are required");
    }

    if (!VALID_STATUSES.includes(data.status)) {
      throw new Error("status must be present, late, or absent");
    }

    return attendanceRepository.create(data);
  }

  getReport() {
    const records = this.getAttendance();
    const total = records.length;
    const present = records.filter((record) => record.status === "present").length;
    const late = records.filter((record) => record.status === "late").length;
    const absent = records.filter((record) => record.status === "absent").length;

    return {
      total,
      present,
      late,
      absent,
      participationRate: total ? Number(((present + late) / total * 100).toFixed(2)) : 0,
    };
  }
}

module.exports = new AttendanceService();
