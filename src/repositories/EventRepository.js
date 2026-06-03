const db = require("../config/db");

class EventRepository {
  async findAllByClub(clubId) {
    const [rows] = await db.query(
      `
      SELECT
        e.id,
        e.club_id,
        e.title,
        e.description,
        e.location,
        e.event_date,
        e.created_by,
        e.created_at,
        COUNT(er.id) AS registration_count
      FROM events e
      LEFT JOIN event_registrations er ON er.event_id = e.id
      WHERE e.club_id = ?
      GROUP BY e.id, e.club_id, e.title, e.description, e.location, e.event_date, e.created_by, e.created_at
      ORDER BY e.event_date ASC
      `,
      [clubId]
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await db.query(
      `
      SELECT
        e.id,
        e.club_id,
        e.title,
        e.description,
        e.location,
        e.event_date,
        e.created_by,
        e.created_at,
        COUNT(er.id) AS registration_count
      FROM events e
      LEFT JOIN event_registrations er ON er.event_id = e.id
      WHERE e.id = ?
      GROUP BY e.id, e.club_id, e.title, e.description, e.location, e.event_date, e.created_by, e.created_at
      `,
      [id]
    );
    return rows[0] || null;
  }

  async create(event) {
    await db.execute(
      "INSERT INTO events (id, club_id, title, description, location, event_date, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        event.id,
        event.club_id,
        event.title,
        event.description,
        event.location,
        event.event_date,
        event.created_by,
        event.created_at,
      ]
    );
    return event;
  }

  async update(id, changes) {
    const allowedFields = new Set(["title", "description", "location", "event_date"]);
    const fields = Object.keys(changes).filter((field) => allowedFields.has(field));

    if (!fields.length) {
      return this.findById(id);
    }

    const setClause = fields.map((field) => `\`${field}\` = ?`).join(", ");
    const values = fields.map((field) => changes[field]);
    await db.execute(`UPDATE events SET ${setClause} WHERE id = ?`, [...values, id]);

    return this.findById(id);
  }

  async deleteById(id) {
    const [result] = await db.execute("DELETE FROM events WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  async findRegistration(eventId, userId) {
    const [rows] = await db.query(
      "SELECT * FROM event_registrations WHERE event_id = ? AND user_id = ?",
      [eventId, userId]
    );
    return rows[0] || null;
  }

  async registerForEvent(registration) {
    await db.execute(
      "INSERT INTO event_registrations (id, event_id, user_id, created_at) VALUES (?, ?, ?, ?)",
      [registration.id, registration.event_id, registration.user_id, registration.created_at]
    );
    return registration;
  }
}

module.exports = EventRepository;
