const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const UserController = require("../controllers/UserController");

const router = express.Router();

router.use(authMiddleware);

router.get("/me", UserController.profile.bind(UserController));
router.put("/me/profile", UserController.updateProfile.bind(UserController));
router.patch("/me/password", UserController.changePassword.bind(UserController));

router.get("/", UserController.list.bind(UserController));
router.post("/", UserController.create.bind(UserController));
router.get("/:userId", UserController.show.bind(UserController));
router.put("/:userId", UserController.update.bind(UserController));
router.patch("/:userId/role", UserController.assignRole.bind(UserController));
router.delete("/:userId", UserController.remove.bind(UserController));

module.exports = router;
