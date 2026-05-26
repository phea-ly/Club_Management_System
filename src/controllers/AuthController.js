const AuthService = require("../services/AuthService");

class AuthController {
    constructor(authService = new AuthService()) {
        this.authService = authService;

        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    async register(req, res) {
        try {
            const result = await this.authService.register(req.body);

            return res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error("Register error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
    }

    async login(req, res) {
        try {
            const result = await this.authService.login(req.body);

            return res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error("Login error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
    }
}

module.exports = new AuthController();
