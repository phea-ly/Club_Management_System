const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const MemberController = require("../controllers/MemberController");

const router = express.Router();

router.use(authMiddleware);

router.get("/club/:clubId", MemberController.list.bind(MemberController));
router.post("/club/:clubId", MemberController.add.bind(MemberController));
router.get("/club/:clubId/:memberId/participation", MemberController.participation.bind(MemberController));
router.patch("/club/:clubId/:memberId/status", MemberController.updateStatus.bind(MemberController));
router.delete("/club/:clubId/:memberId", MemberController.remove.bind(MemberController));

module.exports = router;
