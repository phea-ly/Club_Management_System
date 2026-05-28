class Club {
  constructor({
    id,
    name,
    description,
    category,
    leader,
    activities = [],
    members = [],
    joinRequests = [],
    isActive = true,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.leader = leader;
    this.activities = activities;
    this.members = members;
    this.joinRequests = joinRequests;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Club;
