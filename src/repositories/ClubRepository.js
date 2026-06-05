const pool = require("../config/db");

class ClubRepository {
  async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT c.*, u.name as leader_name, u.email as leader_email FROM clubs c LEFT JOIN users u ON c.leader_id = u.id WHERE c.id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const row = rows[0];
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        category: row.category,
        leader_id: row.leader_id,
        leader: {
          id: row.leader_id,
          name: row.leader_name,
          email: row.leader_email,
        },
      };
    } catch (error) {
      console.error('Error finding club by id:', error);
      throw error;
    }
  }
}

module.exports = ClubRepository;
