const express = require("express");
const eventController = require("../controllers/EventController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", requireRoles("admin", "club_leader", "member"), eventController.index);
router.get("/new", requireRoles("admin", "club_leader"), eventController.createForm);
router.post("/", requireRoles("admin", "club_leader"), eventController.store);
router.get("/:id/edit", requireRoles("admin", "club_leader"), eventController.editForm);
router.post("/:id", requireRoles("admin", "club_leader"), eventController.update);
router.post("/:id/delete", requireRoles("admin", "club_leader"), eventController.destroy);
router.post("/:id/register", requireRoles("admin", "club_leader", "member"), eventController.register);

module.exports = router;
