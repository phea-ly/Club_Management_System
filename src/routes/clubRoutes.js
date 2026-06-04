const express = require("express");
const clubController = require("../controllers/ClubController");
const { allowRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", clubController.getClubs);
router.get("/:id", clubController.getClubById);
router.post("/", allowRoles("ADMIN", "LEADER"), clubController.createClub);
router.put("/:id", allowRoles("ADMIN", "LEADER"), clubController.updateClub);
router.delete("/:id", allowRoles("ADMIN", "LEADER"), clubController.deleteClub);

router.post("/:id/join", clubController.requestToJoin);
router.get(
  "/:id/requests",
  allowRoles("ADMIN", "LEADER"),
  clubController.getJoinRequests
);
router.post(
  "/:id/requests/:requestId/:action",
  allowRoles("ADMIN", "LEADER"),
  clubController.reviewJoinRequest
);

module.exports = router;
