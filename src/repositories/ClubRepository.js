const db = require("../config/db");

class ClubRepository {
  async findById(id) {
    const [rows] = await db.query("SELECT * FROM clubs WHERE id = ?", [id]);
    return rows[0] || null;
  }
}

module.exports = ClubRepository;
