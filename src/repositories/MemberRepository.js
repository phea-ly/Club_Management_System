const db = require("../config/db");

class MemberRepository {
  async findMembersByClub(clubId, status = "") {
    let sql = `
      SELECT
        cm.id,
        cm.user_id,
        cm.club_id,
        cm.status,
        cm.joined_at,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(DISTINCT er.id) AS registered_event_count,
        COUNT(DISTINCT CASE WHEN a.status = 'PRESENT' THEN a.id END) AS attended_event_count,
        COUNT(DISTINCT CASE WHEN a.status = 'ABSENT' THEN a.id END) AS absent_event_count
      FROM club_members cm
      JOIN users u ON u.id = cm.user_id
      LEFT JOIN events e ON e.club_id = cm.club_id
      LEFT JOIN event_registrations er ON er.event_id = e.id AND er.user_id = cm.user_id
      LEFT JOIN attendance a ON a.event_id = e.id AND a.user_id = cm.user_id
      WHERE cm.club_id = ?
    `;
    const params = [clubId];

    if (status) {
      sql += " AND cm.status = ?";
      params.push(status);
    }

    sql += `
      GROUP BY cm.id, cm.user_id, cm.club_id, cm.status, cm.joined_at, u.first_name, u.last_name, u.email
      ORDER BY cm.joined_at DESC
    `;

    const [rows] = await db.query(sql, params);
    return rows;
  }

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM club_members WHERE id = ?", [id]);
    return rows[0] || null;
  }

  async findByUserAndClub(userId, clubId) {
    const [rows] = await db.query(
      "SELECT * FROM club_members WHERE user_id = ? AND club_id = ?",
      [userId, clubId]
    );
    return rows[0] || null;
  }

  async create(member) {
    await db.execute(
      "INSERT INTO club_members (id, user_id, club_id, status, joined_at) VALUES (?, ?, ?, ?, ?)",
      [member.id, member.user_id, member.club_id, member.status, member.joined_at]
    );
    return member;
  }

  async updateStatus(id, status) {
    const [result] = await db.execute(
      "UPDATE club_members SET status = ? WHERE id = ?",
      [status, id]
    );
    return result.affectedRows > 0;
  }

  async deleteById(id) {
    const [result] = await db.execute("DELETE FROM club_members WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  async findParticipationByMember(clubId, userId) {
    const [rows] = await db.query(
      `
      SELECT
        e.id AS event_id,
        e.title,
        e.event_date,
        e.location,
        er.created_at AS registered_at,
        COALESCE(a.status, 'REGISTERED') AS participation_status,
        a.recorded_at
      FROM events e
      LEFT JOIN event_registrations er ON er.event_id = e.id AND er.user_id = ?
      LEFT JOIN attendance a ON a.event_id = e.id AND a.user_id = ?
      WHERE e.club_id = ?
        AND (er.id IS NOT NULL OR a.id IS NOT NULL)
      ORDER BY e.event_date DESC
      `,
      [userId, userId, clubId]
    );
    return rows;
  }
}

module.exports = MemberRepository;
