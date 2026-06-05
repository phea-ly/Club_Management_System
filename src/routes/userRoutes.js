const express = require("express");
const userController = require("../controllers/UserController");
const { allowRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();
const allowUserAdministration = allowRoles("ADMIN");

router.get("/", allowUserAdministration, userController.getUsers);
router.post("/", allowUserAdministration, userController.provisionUser);
router.patch("/:id/role", allowUserAdministration, userController.assignRole);
router.post("/:id/password-reset", allowUserAdministration, userController.resetPassword);

module.exports = router;
