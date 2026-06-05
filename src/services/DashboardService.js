const clubService = require("./ClubService");
const attendanceService = require("./AttendanceService");

class DashboardService {
  async getStatistics() {
    const clubs = await clubService.getClubs();
    const attendanceReport = attendanceService.getReport();

    return {
      totalClubs: clubs.length,
      totalMembers: clubs.reduce((total, club) => total + club.members.length, 0),
      pendingJoinRequests: clubs.reduce(
        (total, club) =>
          total + club.joinRequests.filter((request) => request.status === "pending").length,
        0
      ),
      attendance: attendanceReport,
    };
  }
}

module.exports = new DashboardService();
