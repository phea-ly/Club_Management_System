const express = require("express");
const eventController = require("../controllers/EventController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", eventController.index.bind(eventController));
router.get("/:id", eventController.show.bind(eventController));

router.post(
    "/",
    authMiddleware,
    roleMiddleware(["club_leader", "leader", "admin"]),
    eventController.store.bind(eventController)
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["club_leader", "leader", "admin"]),
    eventController.update.bind(eventController)
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["club_leader", "leader", "admin"]),
    eventController.destroy.bind(eventController)
);

router.post(
    "/:id/register",
    authMiddleware,
    roleMiddleware(["student", "admin"]),
    eventController.register.bind(eventController)
);

router.get(
    "/:id/registrations",
    authMiddleware,
    roleMiddleware(["club_leader", "leader", "admin"]),
    eventController.registrations.bind(eventController)
);

module.exports = router;
