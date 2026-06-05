const ClubModel = require("../models/ClubModel");

class ClubRepository {
  constructor() {
    this.clubs = [];
    this.nextId = 1;
  }

  findAll() {
    return this.clubs;
  }

  findById(id) {
    return this.clubs.find((club) => club.id === Number(id)) || null;
  }

  create(data) {
    const club = new ClubModel({
      id: this.nextId,
      ...data,
    });

    this.nextId += 1;
    this.clubs.push(club);
    return club;
  }

  update(id, data) {
    const club = this.findById(id);

    if (!club) {
      return null;
    }

    Object.assign(club, data, {
      updatedAt: new Date().toISOString(),
    });

    return club;
  }

  delete(id) {
    const index = this.clubs.findIndex((club) => club.id === Number(id));

    if (index === -1) {
      return null;
    }

    const [removed] = this.clubs.splice(index, 1);
    return removed;
  }
}

module.exports = ClubRepository;
