const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const dataFile = path.join(dataDir, "attendance.json");

class AttendanceRepository {
  ensureStore() {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, "[]");
    }
  }

  findAll() {
    this.ensureStore();
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  }

  writeAll(records) {
    this.ensureStore();
    fs.writeFileSync(dataFile, JSON.stringify(records, null, 2));
  }

  create(data) {
    const records = this.findAll();
    const record = {
      id: Date.now().toString(),
      clubId: data.clubId,
      studentName: data.studentName,
      status: data.status,
      date: data.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    records.push(record);
    this.writeAll(records);
    return record;
  }
}

module.exports = new AttendanceRepository();
