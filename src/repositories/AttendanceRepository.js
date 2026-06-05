const fs = require("fs");
const path = require("path");
const Attendance = require("../models/AttendanceModel");

const dataDir = path.join(__dirname, "../data");
const dataFile = path.join(dataDir, "attendance.json");

class AttendanceRepository {
  constructor() {
    this.ensureStore();
  }

  ensureStore() {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, "[]");
    }
  }

  readAll() {
    this.ensureStore();
    const attendances = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    return attendances.map((attendance) => new Attendance(attendance));
  }

  writeAll(attendances) {
    this.ensureStore();
    fs.writeFileSync(dataFile, JSON.stringify(attendances, null, 2));
  }

  findAll() {
    return this.readAll();
  }

  findById(id) {
    return this.readAll().find((attendance) => attendance.id === id);
  }

  findByClubId(clubId) {
    return this.readAll().filter((attendance) => attendance.clubId === clubId);
  }

  create(data) {
    const attendances = this.readAll();
    const now = new Date().toISOString();
    const attendance = new Attendance({
      id: Date.now().toString(),
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    attendances.push(attendance);
    this.writeAll(attendances);
    return attendance;
  }
}

module.exports = new AttendanceRepository();
