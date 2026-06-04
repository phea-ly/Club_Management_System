const SearchRepository = require("../repositories/SearchRepository");

const normalizeQuery = (query) => String(query || "").trim();

const searchAll = async (query) => {
    const normalizedQuery = normalizeQuery(query);

    if (!normalizedQuery) {
        return {
            query: "",
            clubs: [],
            members: [],
            events: [],
            total: 0,
        };
    }

    const results = await SearchRepository.searchAll(normalizedQuery);

    return {
        query: normalizedQuery,
        ...results,
        total: results.clubs.length + results.members.length + results.events.length,
    };
};

module.exports = { searchAll };
