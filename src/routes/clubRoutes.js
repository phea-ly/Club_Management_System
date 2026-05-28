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
router.post("/", allowRoles("admin", "leader"), clubController.createClub);
router.put("/:id", allowRoles("admin", "leader"), clubController.updateClub);
router.delete("/:id", allowRoles("admin", "leader"), clubController.deleteClub);

router.post("/:id/join", clubController.requestToJoin);
router.get(
  "/:id/requests",
  allowRoles("admin", "leader"),
  clubController.getJoinRequests
);
router.post(
  "/:id/requests/:requestId/:action",
  allowRoles("admin", "leader"),
  clubController.reviewJoinRequest
);

module.exports = router;
