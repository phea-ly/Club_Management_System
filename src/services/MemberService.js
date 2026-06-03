const { randomUUID } = require("crypto");
const AppError = require("../core/errors/AppError");

const ALLOWED_MEMBER_STATUSES = new Set(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"]);

class MemberService {
  constructor(memberRepository, clubRepository, userRepository) {
    this.memberRepository = memberRepository;
    this.clubRepository = clubRepository;
    this.userRepository = userRepository;
  }

  async getMembersByClub(req) {
    const { actorId, isAdmin } = req;
    const { clubId } = req.params;
    const status = this.normalizeStatus(req.query.status || "");

    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new AppError(404, "Club not found.");

    this.assertLeader(actorId, club, isAdmin);
    return this.memberRepository.findMembersByClub(clubId, status);
  }

  async addMember(req) {
    const { actorId, isAdmin } = req;
    const { clubId } = req.params;
    const email = this.normalizeEmail(req.body.email);

    if (!email) throw new AppError(400, "Student email is required.");

    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new AppError(404, "Club not found.");

    this.assertLeader(actorId, club, isAdmin);

    const student = await this.userRepository.findByEmail(email);
    if (!student) throw new AppError(404, "Student user not found.");

    const existing = await this.memberRepository.findByUserAndClub(student.id, clubId);
    if (existing) {
      if (existing.status === "ACTIVE") {
        throw new AppError(400, "Student is already an active member of this club.");
      }

      await this.memberRepository.updateStatus(existing.id, "ACTIVE");
      return this.memberRepository.findById(existing.id);
    }

    const member = {
      id: randomUUID(),
      user_id: student.id,
      club_id: clubId,
      status: "ACTIVE",
      joined_at: this.toMysqlDateTime(new Date()),
    };

    return this.memberRepository.create(member);
  }

  async updateMemberStatus(req) {
    const { actorId, isAdmin } = req;
    const { clubId, memberId } = req.params;
    const status = this.normalizeStatus(req.body.status);

    if (!status) throw new AppError(400, "Member status is required.");

    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new AppError(404, "Club not found.");

    this.assertLeader(actorId, club, isAdmin);

    const member = await this.memberRepository.findById(memberId);
    if (!member || member.club_id !== clubId) {
      throw new AppError(404, "Member record not found.");
    }

    const updated = await this.memberRepository.updateStatus(memberId, status);
    if (!updated) throw new AppError(500, "Failed to update member status.");

    return { id: memberId, status };
  }

  async removeMember(req) {
    const { actorId, isAdmin } = req;
    const { clubId, memberId } = req.params;

    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new AppError(404, "Club not found.");

    this.assertLeader(actorId, club, isAdmin);

    const member = await this.memberRepository.findById(memberId);
    if (!member || member.club_id !== clubId) {
      throw new AppError(404, "Member record not found.");
    }

    if (member.user_id === club.leader_id) {
      throw new AppError(400, "Club leader cannot be removed from their own club.");
    }

    return this.memberRepository.deleteById(memberId);
  }

  async getMemberParticipation(req) {
    const { actorId, isAdmin } = req;
    const { clubId, memberId } = req.params;

    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new AppError(404, "Club not found.");

    this.assertLeader(actorId, club, isAdmin);

    const member = await this.memberRepository.findById(memberId);
    if (!member || member.club_id !== clubId) {
      throw new AppError(404, "Member record not found.");
    }

    return this.memberRepository.findParticipationByMember(clubId, member.user_id);
  }

  assertLeader(actorId, club, isAdmin) {
    if (!isAdmin && club.leader_id !== actorId) {
      throw new AppError(403, "Access denied. Only the club leader can manage members.");
    }
  }

  normalizeEmail(email) {
    return typeof email === "string" ? email.trim().toLowerCase() : "";
  }

  normalizeStatus(status) {
    if (!status) return "";

    const normalized = String(status).trim().toUpperCase();
    if (!ALLOWED_MEMBER_STATUSES.has(normalized)) {
      throw new AppError(400, "Invalid member status.", {
        allowed: Array.from(ALLOWED_MEMBER_STATUSES),
      });
    }

    return normalized;
  }

  toMysqlDateTime(date) {
    return date.toISOString().slice(0, 19).replace("T", " ");
  }
}

module.exports = MemberService;
