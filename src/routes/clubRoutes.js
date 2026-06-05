const express = require("express");
const ClubController = require("../controllers/ClubController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", ClubController.list);
router.get("/:id", ClubController.show);
router.post("/", authMiddleware, ClubController.create);
router.put("/:id", authMiddleware, ClubController.update);
router.delete("/:id", authMiddleware, ClubController.remove);
router.post("/:id/join-requests", authMiddleware, ClubController.requestToJoin);
router.get("/:id/join-requests", authMiddleware, ClubController.joinRequests);

module.exports = router;
