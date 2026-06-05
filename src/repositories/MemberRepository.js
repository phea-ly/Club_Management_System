const MemberModel = require("../models/MemberModel");

class MemberRepository {
  constructor() {
    this.members = [];
    this.nextId = 1;
  }

  findByClubId(clubId) {
    return this.members.filter((member) => member.clubId === Number(clubId));
  }

  findRequest(clubId, studentId) {
    return (
      this.members.find(
        (member) =>
          member.clubId === Number(clubId) && String(member.studentId) === String(studentId)
      ) || null
    );
  }

  createJoinRequest({ clubId, studentId }) {
    const member = new MemberModel({
      id: this.nextId,
      clubId: Number(clubId),
      studentId,
    });

    this.nextId += 1;
    this.members.push(member);
    return member;
  }

  deleteByClubId(clubId) {
    this.members = this.members.filter((member) => member.clubId !== Number(clubId));
  }
}

module.exports = MemberRepository;
