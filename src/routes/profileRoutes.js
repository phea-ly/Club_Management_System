const express = require("express");
const userController = require("../controllers/UserController");

const router = express.Router();

router.get("/:id", userController.profileForm);
router.post("/:id", userController.updateProfile);
router.get("/:id/password", userController.passwordForm);
router.post("/:id/password", userController.changePassword);

module.exports = router;
