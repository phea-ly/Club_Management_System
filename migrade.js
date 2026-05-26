require("dotenv").config();
const db = require("./src/config/db");

async function migrate() {
    try {
        console.log("Creating roles table...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id CHAR(36) PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                permissions JSON NOT NULL
            )
        `);

        console.log("Creating users table...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id CHAR(36) PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role_id CHAR(36),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_users_role
                    FOREIGN KEY (role_id)
                    REFERENCES roles(id)
            )
        `);

        console.log("Seeding default roles...");
        await db.query(`
            INSERT INTO roles (id, name, permissions) VALUES
                (UUID(), 'ADMIN', JSON_ARRAY('MANAGE_USERS', 'MANAGE_ROLES', 'VIEW_DASHBOARD')),
                (UUID(), 'CLUB_LEADER', JSON_ARRAY('MANAGE_MEMBERS', 'VIEW_DASHBOARD')),
                (UUID(), 'MEMBER', JSON_ARRAY('VIEW_PROFILE'))
            ON DUPLICATE KEY UPDATE
                permissions = VALUES(permissions)
        `);

        console.log("Migration completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Migration error:", error.message);
        process.exit(1);
    }
}

migrate();
