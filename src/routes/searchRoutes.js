const express = require("express");
const SearchController = require("../controllers/SearchController");

const router = express.Router();

router.get("/", SearchController.index);
router.get("/api", SearchController.api);

module.exports = router;
