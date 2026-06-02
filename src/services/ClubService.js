const clubRepository = require("../repositories/ClubRepository");

const REVIEW_ACTIONS = {
  approve: "approved",
  reject: "rejected",
};

const REQUIRED_FIELDS = ["name", "description", "category"];

class ClubService {
  getClubs() {
    return clubRepository.findActive();
  }

  getClubById(id) {
    const club = clubRepository.findById(id);

    if (!club || !club.isActive) {
      throw new Error("Club not found");
    }

    return club;
  }

  createClub(data) {
    this.validateClubData(data);

    return clubRepository.create({
      name: data.name,
      description: data.description,
      category: data.category,
      leader: data.leader,
      activities: data.activities || [],
    });
  }

  updateClub(id, data = {}) {
    const existingClub = this.getClubById(id);

    return clubRepository.update(existingClub.id, {
      name: data.name ?? existingClub.name,
      description: data.description ?? existingClub.description,
      category: data.category ?? existingClub.category,
      leader: data.leader ?? existingClub.leader,
      activities: data.activities ?? existingClub.activities,
    });
  }

  deleteClub(id) {
    const existingClub = this.getClubById(id);
    return clubRepository.delete(existingClub.id);
  }

  requestToJoin(clubId, student) {
    const club = this.getClubById(clubId);

    if (!student || !this.hasText(student.name)) {
      throw new Error("Student name is required");
    }

    const hasPendingRequest = club.joinRequests.some(
      (request) => request.studentName === student.name && request.status === "pending"
    );

    if (hasPendingRequest) {
      throw new Error("Join request is already pending");
    }

    const joinRequest = this.buildJoinRequest(student);

    club.joinRequests.push(joinRequest);
    clubRepository.update(club.id, club);
    return joinRequest;
  }

  getJoinRequests(clubId) {
    return this.getClubById(clubId).joinRequests;
  }

  reviewJoinRequest(clubId, requestId, action) {
    const club = this.getClubById(clubId);
    const request = club.joinRequests.find((item) => item.id === requestId);

    if (!request) {
      throw new Error("Join request not found");
    }

    if (!REVIEW_ACTIONS[action]) {
      throw new Error("Action must be approve or reject");
    }

    request.status = REVIEW_ACTIONS[action];
    request.reviewedAt = new Date().toISOString();

    if (action === "approve") {
      this.addMemberFromRequest(club, request);
    }

    clubRepository.update(club.id, club);
    return request;
  }

  validateClubData(data) {
    const hasMissingField = REQUIRED_FIELDS.some(
      (field) => !this.hasText(data?.[field])
    );

    if (hasMissingField || !this.hasLeaderData(data?.leader)) {
      throw new Error("Club name, description, category, and leader are required");
    }
  }

  hasLeaderData(leader) {
    if (this.hasText(leader)) {
      return true;
    }

    return Boolean(leader) && this.hasText(leader.name);
  }

  buildJoinRequest(student) {
    return {
      id: Date.now().toString(),
      studentName: student.name,
      studentEmail: student.email || "",
      reason: student.reason || "",
      status: "pending",
      requestedAt: new Date().toISOString(),
      reviewedAt: null,
    };
  }

  addMemberFromRequest(club, request) {
    const alreadyMember = club.members.some(
      (member) => member.name === request.studentName
    );

    if (alreadyMember) {
      return;
    }

    club.members.push({
      name: request.studentName,
      email: request.studentEmail,
      joinedAt: new Date().toISOString(),
    });
  }

  hasText(value) {
    return typeof value === "string" && value.trim().length > 0;
  }
}

module.exports = new ClubService();
