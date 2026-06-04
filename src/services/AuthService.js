const userRepository = require("../repositories/UserRepository");

const DEFAULT_ADMIN = {
  name: "System Admin",
  email: "admin@club.local",
  password: "admin123",
  role: "ADMIN",
};

class AuthService {
  constructor() {
    this.ensureDefaultAdmin();
  }

  ensureDefaultAdmin() {
    if (userRepository.findAll().length > 0) {
      return;
    }

    userRepository.create(DEFAULT_ADMIN);
  }

  login(email, password) {
    if (!this.hasText(email) || !this.hasText(password)) {
      throw new Error("Email and password are required");
    }

    const user = userRepository.findByEmail(email);

    if (!user || !user.isActive || user.password !== password) {
      throw new Error("Invalid email or password");
    }

    return this.sanitizeUser(user);
  }

  sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  hasText(value) {
    return typeof value === "string" && value.trim().length > 0;
  }
}

module.exports = new AuthService();
