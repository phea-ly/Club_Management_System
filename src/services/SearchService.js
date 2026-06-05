const SearchRepository = require("../repositories/SearchRepository");

const normalizeQuery = (query) => String(query || "").trim();

const normalizeFilters = (params = {}) => ({
    clubCategory: normalizeQuery(params.clubCategory),
    eventDate: normalizeQuery(params.eventDate),
    memberStatus: normalizeQuery(params.memberStatus),
});

const normalizePagination = (params = {}) => {
    const page = Math.max(Number.parseInt(params.page, 10) || 1, 1);
    const requestedPerPage = Number.parseInt(params.perPage, 10) || 10;
    const perPage = Math.min(Math.max(requestedPerPage, 1), 50);

    return {
        page,
        perPage,
        offset: (page - 1) * perPage,
    };
};

const hasActiveFilters = (filters) => Object.values(filters).some(Boolean);

const getTotalPages = (counts, perPage) => Math.max(
    ...Object.values(counts).map((count) => Math.ceil(count / perPage)),
    1
);

const searchAll = async (params = {}) => {
    const normalizedQuery = normalizeQuery(params.q);
    const filters = normalizeFilters(params);
    const pagination = normalizePagination(params);
    const shouldListResults = Boolean(normalizedQuery) || hasActiveFilters(filters);

    const [counts, results] = await Promise.all([
        SearchRepository.countAll(normalizedQuery, filters),
        shouldListResults
            ? SearchRepository.searchAll(normalizedQuery, filters, pagination)
            : Promise.resolve({ clubs: [], members: [], events: [] }),
    ]);

    return {
        query: normalizedQuery,
        filters,
        counts,
        ...results,
        total: counts.clubs + counts.members + counts.events,
        pagination: {
            page: pagination.page,
            perPage: pagination.perPage,
            totalPages: getTotalPages(counts, pagination.perPage),
        },
    };
};

module.exports = { searchAll };
