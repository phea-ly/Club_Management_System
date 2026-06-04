const SearchService = require("../services/SearchService");
const { renderSearchPage } = require("../views/search/search_page");

const index = async (req, res, next) => {
    try {
        const results = await SearchService.searchAll(req.query.q);
        res.send(renderSearchPage(results));
    } catch (error) {
        next(error);
    }
};

const api = async (req, res, next) => {
    try {
        const results = await SearchService.searchAll(req.query.q);
        res.json(results);
    } catch (error) {
        next(error);
    }
};

module.exports = { index, api };
