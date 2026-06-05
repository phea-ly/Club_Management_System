const SearchRepository = require("../repositories/SearchRepository");

const normalizeQuery = (query) => String(query || "").trim();

const searchAll = async (query) => {
    const normalizedQuery = normalizeQuery(query);

    if (!normalizedQuery) {
        const counts = await SearchRepository.countAll();

        return {
            query: "",
            counts,
            clubs: [],
            members: [],
            events: [],
            total: counts.clubs + counts.members + counts.events,
        };
    }

    const results = await SearchRepository.searchAll(normalizedQuery);

    return {
        query: normalizedQuery,
        counts: null,
        ...results,
        total: results.clubs.length + results.members.length + results.events.length,
    };
};

module.exports = { searchAll };
