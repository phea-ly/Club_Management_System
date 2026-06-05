const clubRepository = require("../repositories/ClubRepository");

const REVIEW_ACTIONS = {
  approve: "approved",
  reject: "rejected",
};

const REQUIRED_FIELDS = ["name", "description", "category"];

class ClubService {
  async getClubs() {
    return clubRepository.findActive();
  }

  async getClubById(id) {
    const club = await clubRepository.findById(id);

    if (!club || !club.isActive) {
      throw new Error("Club not found");
    }

    return club;
  }

  async createClub(data) {
    this.validateClubData(data);

    return clubRepository.create({
      name: data.name,
      description: data.description,
      category: data.category,
      leader: data.leader,
      activities: data.activities || [],
    });
  }

  async updateClub(id, data = {}) {
    const existingClub = await this.getClubById(id);

    return clubRepository.update(existingClub.id, {
      name: data.name ?? existingClub.name,
      description: data.description ?? existingClub.description,
      category: data.category ?? existingClub.category,
      leader: data.leader ?? existingClub.leader,
      activities: data.activities ?? existingClub.activities,
    });
  }

  async deleteClub(id) {
    const existingClub = await this.getClubById(id);
    return clubRepository.delete(existingClub.id);
  }

  async requestToJoin(clubId, student) {
    const club = await this.getClubById(clubId);

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
    await clubRepository.update(club.id, club);
    return joinRequest;
  }

  async getJoinRequests(clubId) {
    const club = await this.getClubById(clubId);
    return club.joinRequests;
  }

  async reviewJoinRequest(clubId, requestId, action) {
    const club = await this.getClubById(clubId);
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

    await clubRepository.update(club.id, club);
    return request;
  }

  validateClubData(data) {
    const hasMissingField = REQUIRED_FIELDS.some((field) => !this.hasText(data?.[field]));
    const hasMissingLeader = !data?.leader || !this.hasText(data.leader.name);

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
