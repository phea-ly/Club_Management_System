const express = require("express");
const authController = require("../controllers/AuthController");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/login", authController.showLoginForm);
router.post("/login", authController.login);
router.post("/logout", requireAuth, authController.logout);
router.get("/me", requireAuth, authController.me);

module.exports = router;
