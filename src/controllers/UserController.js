const UserService = require("../services/UserService");

class UserController {
    constructor(userService = new UserService()) {
        this.userService = userService;

        this.getUsers = this.getUsers.bind(this);
    }

    async getUsers(req, res) {
        try {
            const result = await this.userService.getUsers();

            return res.json(result);
        } catch (error) {
            console.error("Get users error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
    }
}

module.exports = new UserController();
