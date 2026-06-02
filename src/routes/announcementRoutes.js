const express = require("express");
const announcementController = require("../controllers/AnnouncementController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireRoles = require("../middlewares/roleMiddleware");

const router = express.Router();
const canPublishAnnouncements = [authMiddleware, requireRoles("admin", "leader", "club_leader")];

router.get("/", announcementController.index.bind(announcementController));
router.get("/:id", announcementController.show.bind(announcementController));
router.post("/", canPublishAnnouncements, announcementController.store.bind(announcementController));
router.put("/:id", canPublishAnnouncements, announcementController.update.bind(announcementController));
router.delete("/:id", canPublishAnnouncements, announcementController.destroy.bind(announcementController));

module.exports = router;
