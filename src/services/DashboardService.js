const clubRepository = require("../repositories/ClubRepository");
const attendanceService = require("./AttendanceService");

class DashboardService {
  getStatistics(filters = {}) {
    const clubs = this.filterClubs(clubRepository.findActive(), filters);
    const attendanceReport = attendanceService.getReport(filters);
    const now = new Date();
    const upcomingEvents = this.getUpcomingEvents(clubs, filters, now);

    return {
      totalClubs: clubs.length,
      totalMembers: this.countUniqueMembers(clubs),
      upcomingEvents: upcomingEvents.length,
      studentParticipation: attendanceReport.totals.participationPercentage,
      attendance: attendanceReport.totals,
    };
  }

  getActivityReports(filters = {}) {
    const clubs = this.filterClubs(clubRepository.findActive(), filters);
    const attendanceHistory = attendanceService.getAttendanceHistory(filters);

    return clubs.map((club) => {
      const clubAttendance = attendanceHistory.filter(
        (attendance) => attendance.clubId === club.id
      );
      const report = attendanceService.getReport({ ...filters, clubId: club.id });

      return {
        clubId: club.id,
        clubName: club.name,
        category: club.category,
        leader: club.leader,
        members: club.members.length,
        activities: club.activities,
        attendanceActivities: clubAttendance.length,
        pendingJoinRequests: club.joinRequests.filter(
          (request) => request.status === "pending"
        ).length,
        attendance: report.totals,
      };
    });
  }

  getUpcomingEvents(clubs, filters = {}, now = new Date()) {
    const upcomingFromAttendance = attendanceService
      .getAttendanceHistory(filters)
      .filter(
        (attendance) =>
          attendance.activityType === "event" && new Date(attendance.activityDate) >= now
      )
      .map((attendance) => ({
        clubId: attendance.clubId,
        name: attendance.activityName,
        date: attendance.activityDate,
      }));

    const upcomingFromClubs = clubs.flatMap((club) =>
      club.activities
        .filter((activity) => typeof activity === "object" && activity.date)
        .filter((activity) => new Date(activity.date) >= now)
        .map((activity) => ({
          clubId: club.id,
          name: activity.name || activity.title || "Club activity",
          date: activity.date,
        }))
    );

    return [...upcomingFromAttendance, ...upcomingFromClubs];
  }

  countUniqueMembers(clubs) {
    const members = new Set();

    clubs.forEach((club) => {
      club.members.forEach((member) => {
        const memberKey = member.email || member.name;

        if (memberKey) {
          members.add(memberKey.trim().toLowerCase());
        }
      });
    });

    return members.size;
  }

  filterClubs(clubs, filters = {}) {
    if (!filters.clubId) {
      return clubs;
    }

    return clubs.filter((club) => club.id === filters.clubId);
  }
}

module.exports = new DashboardService();
