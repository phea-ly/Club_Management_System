const pool = require("../config/db");
const MemberModel = require("../models/MemberModel");

class MemberRepository {
  async findMembersByClub(clubId, status = "") {
    try {
      let query = `
        SELECT 
          cm.id, 
          cm.user_id, 
          cm.club_id, 
          cm.status, 
          cm.joined_at,
          u.first_name,
          u.last_name,
          u.email,
          COALESCE(registered_count.count, 0) as registered_event_count,
          COALESCE(attended_count.count, 0) as attended_event_count,
          COALESCE(absent_count.count, 0) as absent_event_count
        FROM club_members cm
        JOIN users u ON cm.user_id = u.id
        LEFT JOIN (
          SELECT user_id, COUNT(*) as count 
          FROM attendance 
          WHERE club_id = ?
          GROUP BY user_id
        ) registered_count ON cm.user_id = registered_count.user_id
        LEFT JOIN (
          SELECT user_id, COUNT(*) as count 
          FROM attendance 
          WHERE club_id = ? AND participation_status = 'PRESENT'
          GROUP BY user_id
        ) attended_count ON cm.user_id = attended_count.user_id
        LEFT JOIN (
          SELECT user_id, COUNT(*) as count 
          FROM attendance 
          WHERE club_id = ? AND participation_status = 'ABSENT'
          GROUP BY user_id
        ) absent_count ON cm.user_id = absent_count.user_id
        WHERE cm.club_id = ?
      `;
      
      const params = [clubId, clubId, clubId, clubId];
      
      if (status) {
        query += ` AND cm.status = ?`;
        params.push(status);
      }
      
      const [rows] = await pool.execute(query, params);
      return rows.map(row => this.formatMember(row));
    } catch (error) {
      console.error('Error finding members by club:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          cm.id, 
          cm.user_id, 
          cm.club_id, 
          cm.status, 
          cm.joined_at,
          u.first_name,
          u.last_name,
          u.email,
          COALESCE(registered_count.count, 0) as registered_event_count,
          COALESCE(attended_count.count, 0) as attended_event_count,
          COALESCE(absent_count.count, 0) as absent_event_count
        FROM club_members cm
        JOIN users u ON cm.user_id = u.id
        LEFT JOIN (
          SELECT user_id, COUNT(*) as count 
          FROM attendance 
          WHERE club_id = cm.club_id
          GROUP BY user_id
        ) registered_count ON cm.user_id = registered_count.user_id
        LEFT JOIN (
          SELECT user_id, COUNT(*) as count 
          FROM attendance 
          WHERE club_id = cm.club_id AND participation_status = 'PRESENT'
          GROUP BY user_id
        ) attended_count ON cm.user_id = attended_count.user_id
        LEFT JOIN (
          SELECT user_id, COUNT(*) as count 
          FROM attendance 
          WHERE club_id = cm.club_id AND participation_status = 'ABSENT'
          GROUP BY user_id
        ) absent_count ON cm.user_id = absent_count.user_id
        WHERE cm.id = ?
      `, [id]);
      
      return rows.length > 0 ? this.formatMember(rows[0]) : null;
    } catch (error) {
      console.error('Error finding member by id:', error);
      throw error;
    }
  }

  async findByUserAndClub(userId, clubId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM club_members WHERE user_id = ? AND club_id = ?',
        [userId, clubId]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error finding member by user and club:', error);
      throw error;
    }
  }

  async create(member) {
    try {
      const { id, user_id, club_id, status, joined_at } = member;
      await pool.execute(
        'INSERT INTO club_members (id, user_id, club_id, status, joined_at) VALUES (?, ?, ?, ?, ?)',
        [id, user_id, club_id, status, joined_at]
      );
      
      // Fetch the created member with summary
      return this.findById(id);
    } catch (error) {
      console.error('Error creating member:', error);
      throw error;
    }
  }

  async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE club_members SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating member status:', error);
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM club_members WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  }

  async findParticipationByMember(clubId, userId) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          a.event_id,
          e.title,
          e.event_date,
          e.location,
          a.registered_at,
          a.participation_status,
          a.recorded_at
        FROM attendance a
        JOIN events e ON a.event_id = e.id
        WHERE a.club_id = ? AND a.user_id = ?
        ORDER BY e.event_date DESC
      `, [clubId, userId]);
      
      return rows;
    } catch (error) {
      console.error('Error finding participation:', error);
      throw error;
    }
  }

  formatMember(row) {
    return {
      id: row.id,
      user_id: row.user_id,
      club_id: row.club_id,
      status: row.status,
      joined_at: row.joined_at,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      registered_event_count: row.registered_event_count || 0,
      attended_event_count: row.attended_event_count || 0,
      absent_event_count: row.absent_event_count || 0,
    };
  }
}

module.exports = MemberRepository;
