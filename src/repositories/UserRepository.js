const db = require("../config/db");

class UserRepository {
  async findAll() {
    const [rows] = await db.query(
      `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.role_id,
        r.name AS role,
        u.is_active,
        u.created_at
      FROM users u
      LEFT JOIN roles r ON r.id = u.role_id
      ORDER BY u.created_at DESC
      `
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  }

  async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  }

  async findPublicById(id) {
    const [rows] = await db.query(
      `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.role_id,
        r.name AS role,
        u.is_active,
        u.created_at
      FROM users u
      LEFT JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
      `,
      [id]
    );
    return rows[0] || null;
  }

  async create(user) {
    await db.execute(
      "INSERT INTO users (id, first_name, last_name, email, password_hash, role_id, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.id,
        user.first_name,
        user.last_name,
        user.email,
        user.password_hash,
        user.role_id,
        user.is_active,
        user.created_at,
      ]
    );
    return this.findPublicById(user.id);
  }

  async update(id, changes) {
    const allowedFields = new Set(["first_name", "last_name", "email", "role_id", "is_active"]);
    const fields = Object.keys(changes).filter((field) => allowedFields.has(field));

    if (!fields.length) {
      return this.findPublicById(id);
    }

    const setClause = fields.map((field) => `\`${field}\` = ?`).join(", ");
    const values = fields.map((field) => changes[field]);
    await db.execute(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);

    return this.findPublicById(id);
  }

  async updatePassword(id, passwordHash) {
    const [result] = await db.execute("UPDATE users SET password_hash = ? WHERE id = ?", [
      passwordHash,
      id,
    ]);
    return result.affectedRows > 0;
  }

  async deactivateById(id) {
    const [result] = await db.execute("UPDATE users SET is_active = 0 WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  async findRoleByName(name) {
    const [rows] = await db.query("SELECT * FROM roles WHERE name = ?", [name]);
    return rows[0] || null;
  }
}

module.exports = UserRepository;
