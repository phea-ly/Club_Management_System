const attendanceRepository = require("../repositories/AttendanceRepository");
const clubService = require("./ClubService");

const VALID_STATUSES = ["present", "absent", "late"];

class AttendanceService {
  getAttendanceHistory(filters = {}) {
    let history = attendanceRepository.findAll();

    if (filters.clubId) {
      history = history.filter((attendance) => attendance.clubId === filters.clubId);
    }

    if (filters.month) {
      history = history.filter((attendance) =>
        attendance.activityDate.startsWith(filters.month)
      );
    }

    return history.sort((a, b) => new Date(b.activityDate) - new Date(a.activityDate));
  }

  getAttendanceById(id) {
    const attendance = attendanceRepository.findById(id);

    if (!attendance) {
      throw new Error("Attendance record not found");
    }

    return attendance;
  }

  recordAttendance(data = {}) {
    this.validateAttendanceData(data);
    const club = clubService.getClubById(data.clubId);

    const memberRecords = data.records.map((record) =>
      this.buildMemberRecord(record, club.members)
    );

    return attendanceRepository.create({
      clubId: club.id,
      activityName: data.activityName.trim(),
      activityType: data.activityType || "meeting",
      activityDate: this.normalizeDate(data.activityDate),
      recordedBy: data.recordedBy || null,
      records: memberRecords,
      summary: this.buildSummary(memberRecords),
    });
  }

  getStudentHistory(studentKey) {
    if (!this.hasText(studentKey)) {
      throw new Error("Student name or email is required");
    }

    const normalizedKey = studentKey.trim().toLowerCase();

    return attendanceRepository
      .findAll()
      .map((attendance) => {
        const studentRecord = attendance.records.find((record) =>
          [record.studentName, record.studentEmail]
            .filter(Boolean)
            .some((value) => value.toLowerCase() === normalizedKey)
        );

        if (!studentRecord) {
          return null;
        }

        return {
          attendanceId: attendance.id,
          clubId: attendance.clubId,
          activityName: attendance.activityName,
          activityType: attendance.activityType,
          activityDate: attendance.activityDate,
          status: studentRecord.status,
          note: studentRecord.note,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.activityDate) - new Date(a.activityDate));
  }

  getReport(filters = {}) {
    const history = this.getAttendanceHistory(filters);
    const studentTotals = {};
    const totals = {
      activities: history.length,
      records: 0,
      present: 0,
      absent: 0,
      late: 0,
    };

    history.forEach((attendance) => {
      attendance.records.forEach((record) => {
        const key = record.studentEmail || record.studentName;

        if (!studentTotals[key]) {
          studentTotals[key] = {
            studentName: record.studentName,
            studentEmail: record.studentEmail,
            present: 0,
            absent: 0,
            late: 0,
            total: 0,
            attendancePercentage: 0,
            participationPercentage: 0,
          };
        }

        totals.records += 1;
        totals[record.status] += 1;
        studentTotals[key][record.status] += 1;
        studentTotals[key].total += 1;
      });
    });

    const students = Object.values(studentTotals).map((student) => ({
      ...student,
      attendancePercentage: this.percentage(student.present, student.total),
      participationPercentage: this.percentage(
        student.present + student.late,
        student.total
      ),
    }));

    return {
      filters,
      totals: {
        ...totals,
        attendancePercentage: this.percentage(totals.present, totals.records),
        participationPercentage: this.percentage(
          totals.present + totals.late,
          totals.records
        ),
      },
      students,
    };
  }

  validateAttendanceData(data) {
    if (!this.hasText(data.clubId)) {
      throw new Error("Club id is required");
    }

    if (!this.hasText(data.activityName)) {
      throw new Error("Activity name is required");
    }

    if (!this.isValidDate(data.activityDate)) {
      throw new Error("Activity date must be a valid date");
    }

    if (!Array.isArray(data.records) || data.records.length === 0) {
      throw new Error("At least one attendance record is required");
    }
  }

  buildMemberRecord(record, members) {
    if (!this.hasText(record?.studentName) && !this.hasText(record?.studentEmail)) {
      throw new Error("Student name or email is required for each record");
    }

    if (!VALID_STATUSES.includes(record.status)) {
      throw new Error("Attendance status must be present, absent, or late");
    }

    const member = this.findClubMember(record, members);

    if (!member) {
      throw new Error("Attendance can only be recorded for club members");
    }

    return {
      studentName: member.name,
      studentEmail: member.email || "",
      status: record.status,
      note: record.note || "",
    };
  }

  findClubMember(record, members) {
    return members.find((member) => {
      const recordName = record.studentName?.trim().toLowerCase();
      const recordEmail = record.studentEmail?.trim().toLowerCase();
      const memberName = member.name?.trim().toLowerCase();
      const memberEmail = member.email?.trim().toLowerCase();

      return (
        (recordEmail && memberEmail && recordEmail === memberEmail) ||
        (recordName && memberName && recordName === memberName)
      );
    });
  }

  buildSummary(records) {
    const summary = {
      total: records.length,
      present: 0,
      absent: 0,
      late: 0,
      attendancePercentage: 0,
      participationPercentage: 0,
    };

    records.forEach((record) => {
      summary[record.status] += 1;
    });

    summary.attendancePercentage = this.percentage(summary.present, summary.total);
    summary.participationPercentage = this.percentage(
      summary.present + summary.late,
      summary.total
    );

    return summary;
  }

  normalizeDate(value) {
    return new Date(value).toISOString();
  }

  isValidDate(value) {
    return Boolean(value) && !Number.isNaN(new Date(value).getTime());
  }

  percentage(value, total) {
    if (!total) {
      return 0;
    }

    return Number(((value / total) * 100).toFixed(2));
  }

  hasText(value) {
    return typeof value === "string" && value.trim().length > 0;
  }
}

module.exports = new AttendanceService();
