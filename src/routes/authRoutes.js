const express = require("express");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

router.get("/status", (req, res) => {
    res.json({ ok: true, route: "auth" });
});

router.post("/login", AuthController.login);

module.exports = router;
