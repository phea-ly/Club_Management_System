const db = require("../config/db");

class UserRepository {
  async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  }

  async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  }
}

module.exports = UserRepository;
