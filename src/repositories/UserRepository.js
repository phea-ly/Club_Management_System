const db = require("../config/db");

class UserRepository {
    async findActiveByEmail(email) {
        const [users] = await db.execute(
            `SELECT
                users.id,
                users.first_name,
                users.last_name,
                users.email,
                users.password_hash,
                roles.name AS role
            FROM users
            LEFT JOIN roles ON users.role_id = roles.id
            WHERE users.email = ? AND users.is_active = TRUE
            LIMIT 1`,
            [email]
        );

        return users[0] || null;
    }

    async findByEmail(email) {
        const [users] = await db.execute(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        return users[0] || null;
    }

    async findRoleByName(name) {
        const [roles] = await db.execute(
            "SELECT id, name FROM roles WHERE name = ? LIMIT 1",
            [name]
        );

        return roles[0] || null;
    }

    async create(user) {
        await db.execute(
            `INSERT INTO users (id, first_name, last_name, email, password_hash, role_id)
             VALUES (UUID(), ?, ?, ?, ?, ?)`,
            [
                user.firstName,
                user.lastName,
                user.email,
                user.passwordHash,
                user.roleId
            ]
        );
    }

    async findAll() {
        const [users] = await db.execute(`
            SELECT
                users.id,
                users.first_name,
                users.last_name,
                users.email,
                users.is_active,
                users.created_at,
                roles.name AS role
            FROM users
            LEFT JOIN roles ON users.role_id = roles.id
            ORDER BY users.created_at DESC
        `);

        return users;
    }
}

module.exports = UserRepository;
