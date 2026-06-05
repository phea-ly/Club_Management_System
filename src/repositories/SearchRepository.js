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
        filters: {
            clubCategory: ["category", "type"],
        },
    },
    members: {
        table: "users",
        order: "name",
        direction: "ASC",
        fields: {
            id: ["id", "user_id", "member_id"],
            name: ["name", "full_name", "username", "member_name"],
            email: ["email", "user_email", "member_email"],
            status: ["status", "membership_status"],
        },
        searchable: ["name"],
        filters: {
            memberStatus: ["status", "membership_status"],
        },
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
        filters: {
            eventDate: ["event_date", "date", "start_date"],
        },
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

const hasActiveFilters = (filters = {}) => Object.values(filters).some(Boolean);

const hasApplicableActiveFilter = (config, filters = {}) => Object
    .keys(config.filters || {})
    .some((filterName) => Boolean(filters[filterName]));

const buildWhere = (columns, config, query = "", filters = {}) => {
    const conditions = [];
    const params = [];
    const searchColumns = query ? buildSearchColumns(columns, config) : [];

    if (searchColumns.length) {
        conditions.push(`(${searchColumns.map((column) => `${escapeIdentifier(column)} LIKE ?`).join(" OR ")})`);
        params.push(...searchColumns.map(() => like(query)));
    }

    Object.entries(config.filters || {}).forEach(([filterName, candidates]) => {
        const value = filters[filterName];
        const column = value ? pickColumn(columns, candidates) : null;

        if (column) {
            conditions.push(`${escapeIdentifier(column)} = ?`);
            params.push(value);
        }
    });

    return {
        whereClause: conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "",
        params,
    };
};

const runTableQuery = async (config, query = "", filters = {}, pagination = {}) => {
    if (!query && hasActiveFilters(filters) && !hasApplicableActiveFilter(config, filters)) {
        return [];
    }

    const columns = await getColumns(config.table);

    if (!columns.size) {
        return [];
    }

    const selectedColumns = buildSelect(columns, config.fields);
    const { whereClause, params } = buildWhere(columns, config, query, filters);
    const preferredOrderColumn = pickColumn(columns, config.fields[config.order] || [config.order]);
    const orderColumn = preferredOrderColumn || pickColumn(columns, Object.values(config.fields).flat());
    const orderClause = orderColumn ? ` ORDER BY ${escapeIdentifier(orderColumn)} ${config.direction}` : "";
    const limit = Number.isInteger(pagination.perPage) ? pagination.perPage : 10;
    const offset = Number.isInteger(pagination.offset) ? pagination.offset : 0;

    const [rows] = await db.promise().query(
        `SELECT ${selectedColumns.join(", ")}
         FROM ${escapeIdentifier(config.table)}${whereClause}${orderClause}
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    return rows;
};

const safeRunTableQuery = async (config, query = "", filters = {}, pagination = {}) => {
    try {
        return await runTableQuery(config, query, filters, pagination);
    } catch (error) {
        console.error(`Search query failed for ${config.table}:`, error.message);
        return [];
    }
};

const countTable = async (config, query = "", filters = {}) => {
    if (!query && hasActiveFilters(filters) && !hasApplicableActiveFilter(config, filters)) {
        return 0;
    }

    const columns = await getColumns(config.table);

    if (!columns.size) {
        return 0;
    }

    const { whereClause, params } = buildWhere(columns, config, query, filters);

    const [rows] = await db.promise().query(
        `SELECT COUNT(*) AS count
         FROM ${escapeIdentifier(config.table)}${whereClause}`,
        params
    );

    return rows[0]?.count || 0;
};

const safeCountTable = async (config, query = "", filters = {}) => {
    try {
        return await countTable(config, query, filters);
    } catch (error) {
        console.error(`Count query failed for ${config.table}:`, error.message);
        return 0;
    }
};

const countAll = async (query = "", filters = {}) => {
    const [clubs, members, events] = await Promise.all([
        safeCountTable(TABLES.clubs, query, filters),
        safeCountTable(TABLES.members, query, filters),
        safeCountTable(TABLES.events, query, filters),
    ]);

    return { clubs, members, events };
};

const searchAll = async (query, filters, pagination) => {
    const [clubs, members, events] = await Promise.all([
        safeRunTableQuery(TABLES.clubs, query, filters, pagination),
        safeRunTableQuery(TABLES.members, query, filters, pagination),
        safeRunTableQuery(TABLES.events, query, filters, pagination),
    ]);

    return { clubs, members, events };
};

module.exports = { countAll, searchAll };
