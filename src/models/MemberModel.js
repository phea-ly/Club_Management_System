class MemberModel {
  constructor({ id, user_id, club_id, status = "ACTIVE", joined_at }) {
    this.id = id;
    this.user_id = user_id;
    this.club_id = club_id;
    this.status = status;
    this.joined_at = joined_at || new Date().toISOString();
  }
}

module.exports = MemberModel;
