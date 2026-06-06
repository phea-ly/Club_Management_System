const express = require("express");
const clubController = require("../controllers/ClubController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", requireRoles("admin", "club_leader", "member"), clubController.getClubs);
router.get("/new", requireRoles("admin", "club_leader"), clubController.createForm);
router.post("/", requireRoles("admin", "club_leader"), clubController.createClub);
router.get("/:id", requireRoles("admin", "club_leader", "member"), clubController.getClubById);
router.put("/:id", requireRoles("admin", "club_leader"), clubController.updateClub);
router.delete("/:id", requireRoles("admin", "club_leader"), clubController.deleteClub);

router.post("/:id/join", requireRoles("admin", "club_leader", "member"), clubController.requestToJoin);
router.get(
  "/:id/requests",
  requireRoles("admin", "club_leader"),
  clubController.getJoinRequests
);
router.post(
  "/:id/requests/:requestId/:action",
  requireRoles("admin", "club_leader"),
  clubController.reviewJoinRequest
);

module.exports = router;
