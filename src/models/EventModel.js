const db = require("../config/db");

const EVENT_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        event_date DATE NOT NULL,
        event_time TIME NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        club_id INT NULL,
        created_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

const REGISTRATION_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS event_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        student_id INT NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_event_student (event_id, student_id),
        CONSTRAINT fk_registration_event
            FOREIGN KEY (event_id) REFERENCES events(id)
            ON DELETE CASCADE
    )
`;

let initialized = false;

async function ensureTables() {
    if (initialized) {
        return;
    }

    await db.query(EVENT_TABLE_SQL);
    await ensureEventColumns();
    await db.query(REGISTRATION_TABLE_SQL);
    initialized = true;
}

async function ensureEventColumns() {
    const columns = [
        "ADD COLUMN event_date DATE NOT NULL",
        "ADD COLUMN event_time TIME NOT NULL",
        "ADD COLUMN location VARCHAR(255) NOT NULL",
        "ADD COLUMN description TEXT NOT NULL",
        "ADD COLUMN club_id INT NULL",
        "ADD COLUMN created_by INT NULL",
        "ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ];

    for (const columnSql of columns) {
        try {
            await db.query(`ALTER TABLE events ${columnSql}`);
        } catch (error) {
            if (error.code !== "ER_DUP_FIELDNAME") {
                throw error;
            }
        }
    }
}

class EventModel {
    static async findAll() {
        await ensureTables();
        const [rows] = await db.query(
            `SELECT e.*,
                    COUNT(er.id) AS registration_count
             FROM events e
             LEFT JOIN event_registrations er ON er.event_id = e.id
             GROUP BY e.id
             ORDER BY e.event_date ASC, e.event_time ASC`
        );
        return rows;
    }

    static async findById(id) {
        await ensureTables();
        const [rows] = await db.query(
            `SELECT e.*,
                    COUNT(er.id) AS registration_count
             FROM events e
             LEFT JOIN event_registrations er ON er.event_id = e.id
             WHERE e.id = ?
             GROUP BY e.id`,
            [id]
        );
        return rows[0] || null;
    }

    static async create(event) {
        await ensureTables();
        const values = [
            event.title,
            event.date,
            event.time,
            event.location,
            event.description,
            event.clubId || null,
            event.createdBy || null
        ];

        let result;

        try {
            [result] = await db.query(
                `INSERT INTO events
                    (title, event_date, event_time, location, description, club_id, created_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                values
            );
        } catch (error) {
            if (error.code !== "ER_NO_REFERENCED_ROW_2") {
                throw error;
            }

            values[6] = null;
            [result] = await db.query(
                `INSERT INTO events
                    (title, event_date, event_time, location, description, club_id, created_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                values
            );
        }

        return this.findById(result.insertId);
    }

    static async update(id, event) {
        await ensureTables();
        const [result] = await db.query(
            `UPDATE events
             SET title = ?,
                 event_date = ?,
                 event_time = ?,
                 location = ?,
                 description = ?,
                 club_id = ?
             WHERE id = ?`,
            [
                event.title,
                event.date,
                event.time,
                event.location,
                event.description,
                event.clubId || null,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.findById(id);
    }

    static async delete(id) {
        await ensureTables();
        const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }

    static async register(eventId, studentId) {
        await ensureTables();
        await db.query(
            "INSERT INTO event_registrations (event_id, student_id) VALUES (?, ?)",
            [eventId, studentId]
        );

        const [rows] = await db.query(
            "SELECT * FROM event_registrations WHERE event_id = ? AND student_id = ?",
            [eventId, studentId]
        );
        return rows[0];
    }

    static async findRegistration(eventId, studentId) {
        await ensureTables();
        const [rows] = await db.query(
            "SELECT * FROM event_registrations WHERE event_id = ? AND student_id = ?",
            [eventId, studentId]
        );
        return rows[0] || null;
    }

    static async listRegistrations(eventId) {
        await ensureTables();
        const [rows] = await db.query(
            `SELECT id, event_id, student_id, registered_at
             FROM event_registrations
             WHERE event_id = ?
             ORDER BY registered_at DESC`,
            [eventId]
        );
        return rows;
    }
}

module.exports = EventModel;
