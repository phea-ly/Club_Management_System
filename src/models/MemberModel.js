class MemberModel {
  constructor({ id, clubId, studentId, status = "PENDING" }) {
    this.id = id;
    this.clubId = clubId;
    this.studentId = studentId;
    this.status = status;
    this.requestedAt = new Date().toISOString();
  }
}

module.exports = MemberModel;
