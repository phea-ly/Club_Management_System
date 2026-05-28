const pool = require("../config/db");
const AbstractRepository = require("../core/base/AbstractRepository");
const IUserRepository = require("./contracts/IUserRepository");
const { UserFactory } = require("../models/UserModel");

class UserRepository extends AbstractRepository {
    async initialize() {
        return true;
    }

    toModel(row) {
        if (!row) return null;

        return UserFactory.create({
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role,
            phone: row.phone,
            address: row.address,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }

    async findAll() {
        const [rows] = await pool.query("SELECT * FROM users ORDER BY id DESC");
        return rows.map((row) => this.toModel(row));
    }

    async findById(id) {
        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
        return this.toModel(rows[0]);
    }

    async findByEmail(email) {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        return rows[0] || null;
    }

    async create(userData) {
        const [result] = await pool.query(
            "INSERT INTO users (name, email, password_hash, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
            [
                userData.name,
                userData.email,
                userData.passwordHash,
                userData.role,
                userData.phone || null,
                userData.address || null
            ]
        );

        return this.findById(result.insertId);
    }

    async update(id, userData) {
        await pool.query(
            "UPDATE users SET name = ?, email = ?, role = ?, phone = ?, address = ? WHERE id = ?",
            [userData.name, userData.email, userData.role, userData.phone || null, userData.address || null, id]
        );

        return this.findById(id);
    }

    async updateProfile(id, profileData) {
        await pool.query(
            "UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?",
            [profileData.name, profileData.phone || null, profileData.address || null, id]
        );

        return this.findById(id);
    }

    async updatePassword(id, passwordHash) {
        await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, id]);
        return this.findById(id);
    }

    async assignRole(id, role) {
        await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

Object.getOwnPropertyNames(IUserRepository.prototype)
    .filter((method) => method !== "constructor")
    .forEach((method) => {
        if (typeof UserRepository.prototype[method] !== "function") {
            throw new Error(`UserRepository must implement ${method}()`);
        }
    });

module.exports = new UserRepository();
