const express = require("express");
const memberController = require("../controllers/MemberController");

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

router.get("/", allowRoles("admin", "club_leader", "leader"), memberController.index);
router.get("/new", allowRoles("admin", "club_leader", "leader"), memberController.createForm);
router.post("/", allowRoles("admin", "club_leader", "leader"), memberController.store);
router.get("/:id/edit", allowRoles("admin", "club_leader", "leader"), memberController.editForm);
router.post("/:id", allowRoles("admin", "club_leader", "leader"), memberController.update);
router.post("/:id/participation", allowRoles("admin", "club_leader", "leader"), memberController.recordParticipation);
router.post("/:id/delete", allowRoles("admin", "club_leader", "leader"), memberController.destroy);

module.exports = router;
