const db = require("../config/db");

const TABLES = {
    clubs: {
        table: "clubs",
        order: "name",
        direction: "ASC",
        fields: {
            id: ["id", "club_id"],
            name: ["name", "club_name"],
            category: ["category", "type"],
            description: ["description", "details"],
        },
        searchable: ["name"],
    },
    members: {
        table: "members",
        order: "name",
        direction: "ASC",
        fields: {
            id: ["id", "member_id"],
            name: ["name", "member_name", "full_name", "username"],
            email: ["email", "member_email"],
            status: ["status", "membership_status"],
        },
        searchable: ["name"],
    },
    events: {
        table: "events",
        order: "event_date",
        direction: "DESC",
        fields: {
            id: ["id", "event_id"],
            title: ["title", "name", "event_name"],
            event_date: ["event_date", "date", "start_date"],
            location: ["location", "venue"],
            description: ["description", "details"],
        },
        searchable: ["title"],
    },
};

const like = (value) => `%${value}%`;
const escapeIdentifier = (value) => `\`${String(value).replace(/`/g, "``")}\``;

const getColumns = async (table) => {
    const [rows] = await db.promise().query(
        `SELECT COLUMN_NAME
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
        [table]
    );

    return new Set(rows.map((row) => row.COLUMN_NAME));
};

const pickColumn = (columns, candidates) => candidates.find((candidate) => columns.has(candidate));

const buildSelect = (columns, fields) => Object.entries(fields).map(([alias, candidates]) => {
    const column = pickColumn(columns, candidates);

    if (!column) {
        return `NULL AS ${escapeIdentifier(alias)}`;
    }

    return `${escapeIdentifier(column)} AS ${escapeIdentifier(alias)}`;
});

const buildSearchColumns = (columns, config) => config.searchable
    .map((field) => pickColumn(columns, config.fields[field]))
    .filter(Boolean);

const runTableQuery = async (config, query = "") => {
    const columns = await getColumns(config.table);

    if (!columns.size) {
        return [];
    }

    const selectedColumns = buildSelect(columns, config.fields);
    const searchColumns = query ? buildSearchColumns(columns, config) : [];
    const whereClause = searchColumns.length
        ? ` WHERE ${searchColumns.map((column) => `${escapeIdentifier(column)} LIKE ?`).join(" OR ")}`
        : "";
    const preferredOrderColumn = pickColumn(columns, config.fields[config.order] || [config.order]);
    const orderColumn = preferredOrderColumn || pickColumn(columns, Object.values(config.fields).flat());
    const orderClause = orderColumn ? ` ORDER BY ${escapeIdentifier(orderColumn)} ${config.direction}` : "";
    const params = searchColumns.map(() => like(query));

    const [rows] = await db.promise().query(
        `SELECT ${selectedColumns.join(", ")}
         FROM ${escapeIdentifier(config.table)}${whereClause}${orderClause}
         LIMIT 10`,
        params
    );

    return rows;
};

const safeRunTableQuery = async (config, query = "") => {
    try {
        return await runTableQuery(config, query);
    } catch (error) {
        console.error(`Search query failed for ${config.table}:`, error.message);
        return [];
    }
};

const countTable = async (config) => {
    const [rows] = await db.promise().query(
        `SELECT COUNT(*) AS count
         FROM ${escapeIdentifier(config.table)}`
    );

    return rows[0]?.count || 0;
};

const safeCountTable = async (config) => {
    try {
        return await countTable(config);
    } catch (error) {
        console.error(`Count query failed for ${config.table}:`, error.message);
        return 0;
    }
};

const countAll = async () => {
    const [clubs, members, events] = await Promise.all([
        safeCountTable(TABLES.clubs),
        safeCountTable(TABLES.members),
        safeCountTable(TABLES.events),
    ]);

    return { clubs, members, events };
};

const searchAll = async (query) => {
    const [clubs, members, events] = await Promise.all([
        safeRunTableQuery(TABLES.clubs, query),
        safeRunTableQuery(TABLES.members, query),
        safeRunTableQuery(TABLES.events, query),
    ]);

    return { clubs, members, events };
};

module.exports = { countAll, searchAll };
