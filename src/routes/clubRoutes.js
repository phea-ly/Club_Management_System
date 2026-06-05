const express = require("express");
const clubController = require("../controllers/ClubController");

const router = express.Router();

const allowRoles = (...roles) => {
  return (req, res, next) => {
    const role = req.headers["x-user-role"];

    if (!roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `Only ${roles.join(" or ")} can access this action`,
      });
    }

    next();
  };
};

router.get("/", clubController.getClubs);
router.get("/:id", clubController.getClubById);
router.post("/create", allowRoles("admin", "club_leader", "leader"), clubController.createClub);
router.put("/:id", allowRoles("admin", "club_leader", "leader"), clubController.updateClub);
router.delete("/:id", allowRoles("admin", "club_leader", "leader"), clubController.deleteClub);

router.post("/:id/join", clubController.requestToJoin);
router.get(
  "/:id/requests",
  allowRoles("admin", "club_leader", "leader"),
  clubController.getJoinRequests
);
router.post(
  "/:id/requests/:requestId/:action",
  allowRoles("admin", "club_leader", "leader"),
  clubController.reviewJoinRequest
);

module.exports = router;
