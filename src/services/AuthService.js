const ValidationError = require("../core/errors/ValidationError");
const UnauthorizedError = require("../core/errors/UnauthorizedError");
const userRepository = require("../repositories/UserRepository");
const { PasswordService } = require("./UserService");
const {
    createSessionToken,
    buildCookie,
    DEFAULT_TTL_SECONDS,
} = require("../utils/sessionToken");

class AuthService {
    constructor({
        users = userRepository,
        passwordService = new PasswordService(),
        secret = process.env.JWT_SECRET,
        ttlSeconds = DEFAULT_TTL_SECONDS,
    } = {}) {
        this.userRepository = users;
        this.passwordService = passwordService;
        this.secret = secret;
        this.ttlSeconds = ttlSeconds;
    }

    async login(email, password) {
        const normalizedEmail = String(email || "").trim().toLowerCase();

        if (!normalizedEmail || !password) {
            throw new ValidationError("Email and password are required");
        }

        const userRow = await this.userRepository.findByEmail(normalizedEmail);

        if (!userRow || !userRow.password_hash) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const storedPassword = String(userRow.password_hash);
        let isValidPassword = await this.passwordService.verify(password, storedPassword);

        if (!isValidPassword && !storedPassword.includes(":")) {
            isValidPassword = storedPassword === password;

            if (isValidPassword) {
                const upgradedHash = await this.passwordService.hash(password);
                await this.userRepository.updatePassword(userRow.id, upgradedHash);
            }
        }

        if (!isValidPassword) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const user = await this.userRepository.findById(userRow.id);
        if (!user) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const token = createSessionToken({ userId: user.id }, this.secret, this.ttlSeconds);

        return {
            user,
            token,
            cookie: buildCookie(token, this.ttlSeconds),
        };
    }
}

module.exports = new AuthService();
module.exports.AuthService = AuthService;
