require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
const mysql = require("mysql2/promise");

const migrationsDir = path.join(__dirname, "migrations");

async function ensureMigrationsTable(connection) {
    await connection.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            filename VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

async function getAppliedMigrations(connection) {
    const [rows] = await connection.query("SELECT filename FROM schema_migrations ORDER BY filename ASC");
    return new Set(rows.map((row) => row.filename));
}

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        await ensureMigrationsTable(connection);

        const appliedMigrations = await getAppliedMigrations(connection);
        const migrationFiles = (await fs.readdir(migrationsDir))
            .filter((file) => file.endsWith(".sql"))
            .sort();

        if (migrationFiles.length === 0) {
            console.log("No migration files found.");
            return;
        }

        for (const fileName of migrationFiles) {
            if (appliedMigrations.has(fileName)) {
                console.log(`Skipping already applied migration: ${fileName}`);
                continue;
            }

            const filePath = path.join(migrationsDir, fileName);
            const sql = await fs.readFile(filePath, "utf8");

            await connection.beginTransaction();
            try {
                await connection.query(sql);
                await connection.query(
                    "INSERT INTO schema_migrations (filename) VALUES (?)",
                    [fileName]
                );
                await connection.commit();
                console.log(`Applied migration: ${fileName}`);
            } catch (error) {
                await connection.rollback();
                throw error;
            }
        }

        console.log("Migrations completed successfully.");
    } finally {
        await connection.end();
    }
}

run().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
});
