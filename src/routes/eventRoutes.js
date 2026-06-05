const express = require("express");
const eventController = require("../controllers/EventController");

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

router.get("/", allowRoles("admin", "club_leader", "leader"), eventController.index);
router.get("/new", allowRoles("admin", "club_leader", "leader"), eventController.createForm);
router.post("/", allowRoles("admin", "club_leader", "leader"), eventController.store);
router.get("/:id/edit", allowRoles("admin", "club_leader", "leader"), eventController.editForm);
router.post("/:id", allowRoles("admin", "club_leader", "leader"), eventController.update);
router.post("/:id/delete", allowRoles("admin", "club_leader", "leader"), eventController.destroy);

module.exports = router;
