const express = require("express");
const userController = require("../controllers/UserController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(requireAuth, requireRoles("admin"));

router.get("/", userController.index);
router.get("/new", userController.createForm);
router.post("/", userController.store);
router.get("/:id/edit", userController.editForm);
router.post("/:id", userController.update);
router.post("/:id/role", userController.assignRole);
router.post("/:id/delete", userController.destroy);

module.exports = router;
