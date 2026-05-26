const db = require("../config/db");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
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

        const user = users[0];
        const isPasswordCorrect = user && await bcrypt.compare(password, user.password_hash);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "your password incorrect"
            });
        }

        return res.json({
            success: true,
            message: "login successfully",
            user: {
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
};

module.exports = { login };
