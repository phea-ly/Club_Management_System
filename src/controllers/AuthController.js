const db = require("../config/db");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
        });
    }

    try {
        const [existingUsers] = await db.execute(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const [roles] = await db.execute(
            "SELECT id FROM roles WHERE name = ? LIMIT 1",
            ["MEMBER"]
        );

        if (!roles.length) {
            return res.status(500).json({
                success: false,
                message: "Default role not found"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await db.execute(
            `INSERT INTO users (id, first_name, last_name, email, password_hash, role_id)
             VALUES (UUID(), ?, ?, ?, ?, ?)`,
            [firstName, lastName, email, passwordHash, roles[0].id]
        );

        return res.status(201).json({
            success: true,
            message: "register successfully"
        });
    } catch (error) {
        console.error("Register error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
};

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

module.exports = { register, login };
