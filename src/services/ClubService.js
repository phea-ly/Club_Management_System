const AppError = require("../core/errors/AppError");

class ClubService {
  constructor(clubRepository, memberRepository) {
    this.clubRepository = clubRepository;
    this.memberRepository = memberRepository;
  }

  listClubs() {
    return this.clubRepository.findAll();
  }

  getClub(req) {
    const club = this.clubRepository.findById(req.params.id);

    if (!club) {
      throw new AppError(404, "Club not found.");
    }

    return club;
  }

  createClub(req) {
    this.ensureCanManageClub(req);

    const data = this.validateClubPayload(req.body);

    return this.clubRepository.create({
      ...data,
      createdBy: req.actorId,
    });
  }

  updateClub(req) {
    this.ensureCanManageClub(req);

    const currentClub = this.getClub(req);
    this.ensureCanModifyClub(req, currentClub);

    const data = this.validateClubPayload(req.body);
    return this.clubRepository.update(req.params.id, data);
  }

  deleteClub(req) {
    this.ensureCanManageClub(req);

    const currentClub = this.getClub(req);
    this.ensureCanModifyClub(req, currentClub);

    const removed = this.clubRepository.delete(req.params.id);
    this.memberRepository.deleteByClubId(req.params.id);
    return removed;
  }

  requestToJoin(req) {
    const club = this.getClub(req);
    const studentId = req.actorId;

    if (req.role !== "STUDENT" && req.role !== "MEMBER") {
      throw new AppError(403, "Only students can request to join clubs.");
    }

    const existingRequest = this.memberRepository.findRequest(club.id, studentId);

    if (existingRequest) {
      throw new AppError(409, "You already requested to join this club.");
    }

    return this.memberRepository.createJoinRequest({
      clubId: club.id,
      studentId,
    });
  }

  listJoinRequests(req) {
    this.ensureCanManageClub(req);

    const club = this.getClub(req);
    this.ensureCanModifyClub(req, club);

    return this.memberRepository.findByClubId(club.id);
  }

  ensureCanManageClub(req) {
    if (req.isAdmin || req.role === "CLUB_LEADER" || req.role === "LEADER") {
      return;
    }

    throw new AppError(403, "Only administrators or club leaders can manage clubs.");
  }

  ensureCanModifyClub(req, club) {
    if (req.isAdmin || String(club.createdBy) === String(req.actorId)) {
      return;
    }

    throw new AppError(403, "Club leaders can only manage clubs they created.");
  }

  validateClubPayload(payload) {
    const requiredFields = ["name", "description", "category"];
    const missingFields = requiredFields.filter((field) => !String(payload[field] || "").trim());

    if (!payload.leader || !String(payload.leader.name || "").trim()) {
      missingFields.push("leader.name");
    }

    if (missingFields.length > 0) {
      throw new AppError(400, "Missing required club fields.", { missingFields });
    }

    return {
      name: String(payload.name).trim(),
      description: String(payload.description).trim(),
      category: String(payload.category).trim(),
      leader: {
        id: payload.leader.id || null,
        name: String(payload.leader.name).trim(),
        email: payload.leader.email ? String(payload.leader.email).trim() : null,
        phone: payload.leader.phone ? String(payload.leader.phone).trim() : null,
      },
    };
  }
}

module.exports = ClubService;
