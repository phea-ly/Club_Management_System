const express = require("express");
const memberController = require("../controllers/MemberController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(requireAuth, requireRoles("admin", "club_leader"));

router.get("/", memberController.index);
router.get("/new", memberController.createForm);
router.post("/", memberController.store);
router.get("/:id/edit", memberController.editForm);
router.post("/:id", memberController.update);
router.post("/:id/participation", memberController.recordParticipation);
router.post("/:id/delete", memberController.destroy);

module.exports = router;
