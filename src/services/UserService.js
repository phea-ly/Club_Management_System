const crypto = require("crypto");
const AbstractService = require("../core/base/AbstractService");
const NotFoundError = require("../core/errors/NotFoundError");
const ValidationError = require("../core/errors/ValidationError");

const ROLES = ["admin", "member", "club_leader"];

class PasswordService {
    async hash(password) {
        const salt = crypto.randomBytes(16).toString("hex");
        const hash = await this.#pbkdf2(password, salt);
        return `${salt}:${hash}`;
    }

    async verify(password, storedHash) {
        const [salt, hash] = storedHash.split(":");
        const currentHash = await this.#pbkdf2(password, salt);
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(currentHash));
    }

    #pbkdf2(password, salt) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100000, 64, "sha512", (error, derivedKey) => {
                if (error) return reject(error);
                resolve(derivedKey.toString("hex"));
            });
        });
    }
}

class UserService extends AbstractService {
    constructor(userRepository, passwordService = new PasswordService()) {
        super();
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    async getAllUsers() {
        return this.userRepository.findAll();
    }

    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundError("User not found");
        return user;
    }

    async createUser(data) {
        this.#validateUserData(data, true);

        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) throw new ValidationError("Email already exists");

        const passwordHash = await this.passwordService.hash(data.password);

        return this.userRepository.create({
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            passwordHash,
            role: data.role || "member",
            phone: data.phone,
            address: data.address
        });
    }

    async updateUser(id, data) {
        await this.getUserById(id);
        this.#validateUserData(data, false);

        const userWithEmail = await this.userRepository.findByEmail(data.email);
        if (userWithEmail && Number(userWithEmail.id) !== Number(id)) {
            throw new ValidationError("Email already belongs to another user");
        }

        return this.userRepository.update(id, {
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            role: data.role,
            phone: data.phone,
            address: data.address
        });
    }

    async updateProfile(id, data) {
        await this.getUserById(id);
        if (!data.name || data.name.trim().length < 2) {
            throw new ValidationError("Name must be at least 2 characters");
        }

        return this.userRepository.updateProfile(id, {
            name: data.name.trim(),
            phone: data.phone,
            address: data.address
        });
    }

    async assignRole(id, role) {
        await this.getUserById(id);
        if (!ROLES.includes(role)) {
            throw new ValidationError("Invalid role selected");
        }

        return this.userRepository.assignRole(id, role);
    }

    async changePassword(id, data) {
        await this.getUserById(id);
        if (!data.newPassword || data.newPassword.length < 6) {
            throw new ValidationError("New password must be at least 6 characters");
        }

        if (data.newPassword !== data.confirmPassword) {
            throw new ValidationError("Password confirmation does not match");
        }

        const passwordHash = await this.passwordService.hash(data.newPassword);
        return this.userRepository.updatePassword(id, passwordHash);
    }

    async deleteUser(id) {
        await this.getUserById(id);
        return this.userRepository.delete(id);
    }

    #validateUserData(data, requirePassword) {
        if (!data.name || data.name.trim().length < 2) {
            throw new ValidationError("Name must be at least 2 characters");
        }

        if (!data.email || !data.email.includes("@")) {
            throw new ValidationError("A valid email is required");
        }

        if (!ROLES.includes(data.role || "member")) {
            throw new ValidationError("Invalid role selected");
        }

        if (requirePassword && (!data.password || data.password.length < 6)) {
            throw new ValidationError("Password must be at least 6 characters");
        }
    }
}

module.exports = new UserService(require("../repositories/UserRepository"));
module.exports.UserService = UserService;
module.exports.PasswordService = PasswordService;
