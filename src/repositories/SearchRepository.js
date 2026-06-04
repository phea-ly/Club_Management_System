const db = require("../config/db");

const like = (value) => `%${value}%`;

const searchClubs = async (query) => {
    const [rows] = await db.promise().query(
        `SELECT id, name, category, description
         FROM clubs
         WHERE name LIKE ? OR category LIKE ? OR description LIKE ?
         ORDER BY name ASC
         LIMIT 10`,
        [like(query), like(query), like(query)]
    );

    return rows;
};

const searchMembers = async (query) => {
    const [rows] = await db.promise().query(
        `SELECT id, name, email, status
         FROM members
         WHERE name LIKE ? OR email LIKE ? OR status LIKE ?
         ORDER BY name ASC
         LIMIT 10`,
        [like(query), like(query), like(query)]
    );

    return rows;
};

const searchEvents = async (query) => {
    const [rows] = await db.promise().query(
        `SELECT id, title, event_date, location
         FROM events
         WHERE title LIKE ? OR description LIKE ? OR location LIKE ?
         ORDER BY event_date DESC
         LIMIT 10`,
        [like(query), like(query), like(query)]
    );

    return rows;
};

const searchAll = async (query) => {
    const [clubs, members, events] = await Promise.all([
        searchClubs(query),
        searchMembers(query),
        searchEvents(query),
    ]);

    return { clubs, members, events };
};

module.exports = { searchAll };
