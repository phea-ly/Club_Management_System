const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const EventController = require("../controllers/EventController");

const router = express.Router();

router.use(authMiddleware);

router.get("/club/:clubId", EventController.list.bind(EventController));
router.post("/club/:clubId", EventController.create.bind(EventController));
router.put("/:eventId", EventController.update.bind(EventController));
router.delete("/:eventId", EventController.remove.bind(EventController));
router.post("/:eventId/register", EventController.register.bind(EventController));

module.exports = router;
