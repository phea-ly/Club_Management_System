class ClubModel {
  constructor({ id, name, description, category, leader, createdBy }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.leader = leader;
    this.createdBy = createdBy;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = ClubModel;
