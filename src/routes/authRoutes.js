const express = require("express");
const authController = require("../controllers/AuthController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/logout", authController.logout);
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auth API is running",
  });
});

module.exports = router;
