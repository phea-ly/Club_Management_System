const db = require("../config/db");
const AbstractRepository = require("../core/base/AbstractRepository");
const Member = require("../models/MemberModel");

class MemberRepository extends AbstractRepository {
    mapRow(row) {
        if (!row) {
            return null;
        }

        return new Member({
            id: row.id,
            club_id: row.club_id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            status: row.status,
            participation_count: row.participation_count,
            last_participated_at: row.last_participated_at,
            notes: row.notes,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }

    async findAll() {
        const [rows] = await db.query("SELECT * FROM members ORDER BY id DESC");
        return rows.map((row) => this.mapRow(row));
    }

    async findById(id) {
        const [rows] = await db.query("SELECT * FROM members WHERE id = ? LIMIT 1", [id]);
        return this.mapRow(rows[0]);
    }

    async findByClubId(clubId) {
        const [rows] = await db.query(
            "SELECT * FROM members WHERE club_id = ? ORDER BY id DESC",
            [clubId]
        );
        return rows.map((row) => this.mapRow(row));
    }

    async findByClubEmail(clubId, email) {
        const [rows] = await db.query(
            "SELECT * FROM members WHERE club_id = ? AND email = ? LIMIT 1",
            [clubId, email]
        );
        return this.mapRow(rows[0]);
    }

    async create(data) {
        const [result] = await db.query(
            `INSERT INTO members
                (club_id, name, email, phone, status, participation_count, last_participated_at, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.clubId,
                data.name,
                data.email,
                data.phone || null,
                data.status || "active",
                data.participationCount ?? 0,
                data.lastParticipatedAt || null,
                data.notes || null,
            ]
        );

        return this.findById(result.insertId);
    }

    async update(id, data) {
        await db.query(
            `UPDATE members
             SET club_id = ?, name = ?, email = ?, phone = ?, status = ?, participation_count = ?, last_participated_at = ?, notes = ?
             WHERE id = ?`,
            [
                data.clubId,
                data.name,
                data.email,
                data.phone || null,
                data.status,
                data.participationCount ?? 0,
                data.lastParticipatedAt || null,
                data.notes || null,
                id,
            ]
        );

        return this.findById(id);
    }

    async incrementParticipation(id, participatedAt = new Date().toISOString()) {
        await db.query(
            `UPDATE members
             SET participation_count = participation_count + 1,
                 last_participated_at = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [participatedAt, id]
        );

        return this.findById(id);
    }

    async delete(id) {
        const [result] = await db.query("DELETE FROM members WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new MemberRepository();
