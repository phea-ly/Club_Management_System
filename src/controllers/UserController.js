const db = require("../config/db");

const getUsers = async (req, res) => {
    try {
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

        return res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Get users error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
};

module.exports = { getUsers };
