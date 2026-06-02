const db = require("../config/db");
const Announcement = require("../models/AnnouncementModel");

const TABLE_SQL = `
CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    club_id INT NULL,
    author_id INT NULL,
    audience ENUM('members', 'leaders', 'all') NOT NULL DEFAULT 'members',
    event_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

class AnnouncementRepository {
    constructor(connection = db) {
        this.db = connection.promise();
        this.ready = null;
    }

    ensureTable() {
        if (!this.ready) {
            this.ready = this.db.query(TABLE_SQL).then(() => this.ensureColumns());
        }

        return this.ready;
    }

    async ensureColumns() {
        const columns = await this.getColumns();
        const columnNames = new Set(columns.map((column) => column.COLUMN_NAME));

        const migrations = [
            {
                name: "club_id",
                sql: "ALTER TABLE announcements ADD COLUMN club_id INT NULL",
            },
            {
                name: "author_id",
                sql: "ALTER TABLE announcements ADD COLUMN author_id INT NULL",
            },
            {
                name: "audience",
                sql: "ALTER TABLE announcements ADD COLUMN audience ENUM('members', 'leaders', 'all') NOT NULL DEFAULT 'members'",
            },
            {
                name: "event_date",
                sql: "ALTER TABLE announcements ADD COLUMN event_date DATETIME NULL",
            },
            {
                name: "created_at",
                sql: "ALTER TABLE announcements ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
            },
            {
                name: "updated_at",
                sql: "ALTER TABLE announcements ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
            },
        ];

        for (const migration of migrations) {
            if (!columnNames.has(migration.name)) {
                await this.db.query(migration.sql);
            }
        }
    }

    async getColumns() {
        const [rows] = await this.db.query(
            `SELECT COLUMN_NAME
             FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'announcements'`
        );

        return rows;
    }

    async findAll({ clubId, audience, limit = 20, offset = 0 } = {}) {
        await this.ensureTable();

        const where = [];
        const params = [];

        if (clubId) {
            where.push("(club_id = ? OR club_id IS NULL)");
            params.push(clubId);
        }

        if (audience) {
            where.push("(audience = ? OR audience = 'all')");
            params.push(audience);
        }

        const sql = `
            SELECT *
            FROM announcements
            ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
            ORDER BY COALESCE(event_date, created_at) DESC, created_at DESC
            LIMIT ? OFFSET ?`;

        const [rows] = await this.db.query(sql, [...params, Number(limit), Number(offset)]);
        return rows.map((row) => new Announcement(row));
    }

    async findById(id) {
        await this.ensureTable();

        const [rows] = await this.db.query("SELECT * FROM announcements WHERE id = ? LIMIT 1", [id]);
        return rows[0] ? new Announcement(rows[0]) : null;
    }

    async create(data) {
        await this.ensureTable();

        let result;

        try {
            [result] = await this.db.query(
                `INSERT INTO announcements
                    (title, content, club_id, author_id, audience, event_date)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    data.title,
                    data.content,
                    data.club_id || null,
                    data.author_id || null,
                    data.audience || "members",
                    data.event_date || null,
                ]
            );
        } catch (error) {
            if (error.code === "ER_NO_REFERENCED_ROW_2") {
                error.statusCode = 400;
                error.message = "Club ID does not exist. Leave Club ID empty or use an existing club.";
            }

            throw error;
        }

        return this.findById(result.insertId);
    }

    async update(id, data) {
        await this.ensureTable();

        const fields = [];
        const params = [];

        ["title", "content", "club_id", "audience", "event_date"].forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(data, field)) {
                fields.push(`${field} = ?`);
                params.push(data[field] || null);
            }
        });

        if (!fields.length) {
            return this.findById(id);
        }

        await this.db.query(`UPDATE announcements SET ${fields.join(", ")} WHERE id = ?`, [...params, id]);
        return this.findById(id);
    }

    async delete(id) {
        await this.ensureTable();

        const [result] = await this.db.query("DELETE FROM announcements WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new AnnouncementRepository();
