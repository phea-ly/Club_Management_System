const db = require("../config/db");
const AbstractRepository = require("../core/base/AbstractRepository");
const Event = require("../models/EventModel");

class EventRepository extends AbstractRepository {
    mapRow(row) {
        if (!row) {
            return null;
        }

        return new Event({
            id: row.id,
            club_id: row.club_id,
            title: row.title,
            description: row.description,
            location: row.location,
            event_date: row.event_date,
            status: row.status,
            max_participants: row.max_participants,
            attendee_count: row.attendee_count,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    }

    async findAll() {
        const [rows] = await db.query("SELECT * FROM events ORDER BY event_date DESC, id DESC");
        return rows.map((row) => this.mapRow(row));
    }

    async findById(id) {
        const [rows] = await db.query("SELECT * FROM events WHERE id = ? LIMIT 1", [id]);
        return this.mapRow(rows[0]);
    }

    async findByClubId(clubId) {
        const [rows] = await db.query(
            "SELECT * FROM events WHERE club_id = ? ORDER BY event_date DESC, id DESC",
            [clubId]
        );
        return rows.map((row) => this.mapRow(row));
    }

    async create(data) {
        const [result] = await db.query(
            `INSERT INTO events
                (club_id, title, description, location, event_date, status, max_participants, attendee_count)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.clubId,
                data.title,
                data.description || null,
                data.location,
                data.eventDate,
                data.status || "scheduled",
                data.maxParticipants || null,
                data.attendeeCount ?? 0,
            ]
        );

        return this.findById(result.insertId);
    }

    async update(id, data) {
        await db.query(
            `UPDATE events
             SET club_id = ?, title = ?, description = ?, location = ?, event_date = ?, status = ?, max_participants = ?, attendee_count = ?
             WHERE id = ?`,
            [
                data.clubId,
                data.title,
                data.description || null,
                data.location,
                data.eventDate,
                data.status,
                data.maxParticipants || null,
                data.attendeeCount ?? 0,
                id,
            ]
        );

        return this.findById(id);
    }

    async delete(id) {
        const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new EventRepository();
