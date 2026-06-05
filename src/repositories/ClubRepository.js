const db = require("../config/db");
const Club = require("../models/ClubModel");

class ClubRepository {
  mapRow(row) {
    if (!row) {
      return null;
    }

    return new Club({
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      leader: row.leader,
      activities: row.activities,
      members: row.members,
      join_requests: row.join_requests,
      isActive: row.is_active === 1 || row.is_active === "1" || row.is_active === true,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }

  toJson(value, fallback) {
    if (value == null) {
      return JSON.stringify(fallback);
    }

    if (typeof value === "string") {
      return value;
    }

    return JSON.stringify(value);
  }

  normalizeClubData(data, existing = {}) {
    return {
      name: data.name ?? existing.name ?? null,
      description: data.description ?? existing.description ?? null,
      category: data.category ?? existing.category ?? null,
      leader: data.leader ?? existing.leader ?? null,
      activities: data.activities ?? existing.activities ?? [],
      members: data.members ?? existing.members ?? [],
      joinRequests: data.joinRequests ?? data.join_requests ?? existing.joinRequests ?? [],
      isActive: data.isActive ?? existing.isActive ?? true,
    };
  }

  async findAll() {
    const [rows] = await db.query("SELECT * FROM clubs ORDER BY id DESC");
    return rows.map((row) => this.mapRow(row));
  }

  async findActive() {
    const [rows] = await db.query("SELECT * FROM clubs WHERE is_active = 1 ORDER BY id DESC");
    return rows.map((row) => this.mapRow(row));
  }

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM clubs WHERE id = ? LIMIT 1", [id]);
    return this.mapRow(rows[0]);
  }

  async create(data) {
    const now = new Date().toISOString();
    const clubData = this.normalizeClubData(data, {
      members: [],
      joinRequests: [],
      isActive: true,
    });

    const [result] = await db.query(
      `INSERT INTO clubs
        (name, description, category, leader, activities, members, join_requests, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clubData.name,
        clubData.description,
        clubData.category,
        this.toJson(clubData.leader, null),
        this.toJson(clubData.activities, []),
        this.toJson(clubData.members, []),
        this.toJson(clubData.joinRequests, []),
        clubData.isActive ? 1 : 0,
        now,
        now,
      ]
    );

    return this.findById(result.insertId);
  }

  async update(id, data) {
    const existingClub = await this.findById(id);

    if (!existingClub) {
      return null;
    }

    const clubData = this.normalizeClubData(data, existingClub);
    const updatedAt = new Date().toISOString();

    await db.query(
      `UPDATE clubs
       SET name = ?, description = ?, category = ?, leader = ?, activities = ?, members = ?, join_requests = ?, is_active = ?, updated_at = ?
       WHERE id = ?`,
      [
        clubData.name,
        clubData.description,
        clubData.category,
        this.toJson(clubData.leader, null),
        this.toJson(clubData.activities, []),
        this.toJson(clubData.members, []),
        this.toJson(clubData.joinRequests, []),
        clubData.isActive ? 1 : 0,
        updatedAt,
        id,
      ]
    );

    return this.findById(id);
  }

  async delete(id) {
    const existingClub = await this.findById(id);

    if (!existingClub) {
      return null;
    }

    await db.query(
      `UPDATE clubs
       SET is_active = 0, updated_at = ?
       WHERE id = ?`,
      [new Date().toISOString(), id]
    );

    return this.findById(id);
  }
}

module.exports = new ClubRepository();
