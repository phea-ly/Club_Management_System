const express = require("express");
const userController = require("../controllers/UserController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireSelfOrRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/:id", requireSelfOrRoles("id", "admin"), userController.profileForm);
router.post("/:id", requireSelfOrRoles("id", "admin"), userController.updateProfile);
router.get("/:id/password", requireSelfOrRoles("id", "admin"), userController.passwordForm);
router.post("/:id/password", requireSelfOrRoles("id", "admin"), userController.changePassword);

module.exports = router;
