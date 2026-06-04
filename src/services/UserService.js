const userRepository = require("../repositories/UserRepository");
const { normalizeRole } = require("../middlewares/roleMiddleware");

const VALID_ROLES = ["SUPER_ADMIN", "ADMIN", "STAFF", "LEADER", "STUDENT"];

class UserService {
  getUsers() {
    return userRepository.findActive().map((user) => this.sanitizeUser(user));
  }

  provisionUser(data = {}) {
    this.validateUserData(data);

    if (userRepository.findByEmail(data.email)) {
      throw new Error("User email already exists");
    }

    const user = userRepository.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: normalizeRole(data.role),
      password: data.password,
    });

    return this.sanitizeUser(user);
  }

  assignRole(id, role) {
    const user = this.getExistingUser(id);
    const normalizedRole = normalizeRole(role);

    if (!VALID_ROLES.includes(normalizedRole)) {
      throw new Error(`Role must be one of: ${VALID_ROLES.join(", ")}`);
    }

    return this.sanitizeUser(userRepository.update(user.id, { role: normalizedRole }));
  }

  resetPassword(id, password) {
    const user = this.getExistingUser(id);

    if (!this.hasText(password)) {
      throw new Error("Password is required");
    }

    const updatedUser = userRepository.update(user.id, {
      password,
      passwordResetAt: new Date().toISOString(),
    });

    return this.sanitizeUser(updatedUser);
  }

  getExistingUser(id) {
    const user = userRepository.findById(id);

    if (!user || !user.isActive) {
      throw new Error("User not found");
    }

    return user;
  }

  validateUserData(data) {
    if (!this.hasText(data.name)) {
      throw new Error("User name is required");
    }

    if (!this.hasText(data.email)) {
      throw new Error("User email is required");
    }

    if (!this.hasText(data.password)) {
      throw new Error("Password is required");
    }

    const normalizedRole = normalizeRole(data.role);

    if (!VALID_ROLES.includes(normalizedRole)) {
      throw new Error(`Role must be one of: ${VALID_ROLES.join(", ")}`);
    }
  }

  sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  hasText(value) {
    return typeof value === "string" && value.trim().length > 0;
  }
}

module.exports = new UserService();
