const fs = require("fs");
const path = require("path");
const Club = require("../models/ClubModel");

const dataDir = path.join(__dirname, "../data");
const dataFile = path.join(dataDir, "clubs.json");

class ClubRepository {
  constructor() {
    this.ensureStore();
  }

  ensureStore() {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, "[]");
    }
  }

  readAll() {
    this.ensureStore();
    const clubs = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    return clubs.map((club) => new Club(club));
  }

  writeAll(clubs) {
    this.ensureStore();
    fs.writeFileSync(dataFile, JSON.stringify(clubs, null, 2));
  }

  findAll() {
    return this.readAll();
  }

  findActive() {
    return this.readAll().filter((club) => club.isActive);
  }

  findById(id) {
    return this.readAll().find((club) => club.id === id);
  }

  create(data) {
    const clubs = this.readAll();
    const now = new Date().toISOString();
    const club = new Club({
      id: Date.now().toString(),
      ...data,
      activities: data.activities || [],
      members: [],
      joinRequests: [],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    clubs.push(club);
    this.writeAll(clubs);
    return club;
  }

  update(id, data) {
    const clubs = this.readAll();
    const index = clubs.findIndex((club) => club.id === id);

    if (index === -1) {
      return null;
    }

    clubs[index] = new Club({
      ...clubs[index],
      ...data,
      id: clubs[index].id,
      createdAt: clubs[index].createdAt,
      updatedAt: new Date().toISOString(),
    });

    this.writeAll(clubs);
    return clubs[index];
  }

  delete(id) {
    const clubs = this.readAll();
    const index = clubs.findIndex((club) => club.id === id);

    if (index === -1) {
      return null;
    }

    clubs[index].isActive = false;
    clubs[index].updatedAt = new Date().toISOString();
    this.writeAll(clubs);
    return clubs[index];
  }
}

module.exports = new ClubRepository();
