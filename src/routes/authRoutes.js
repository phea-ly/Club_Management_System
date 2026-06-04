const express = require("express");
const authController = require("../controllers/AuthController");

const router = express.Router();

router.get("/login", authController.showLogin);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/logout", authController.logout);

module.exports = router;
