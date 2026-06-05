const AppError = require("../core/errors/AppError");

const ROLES = ["ADMIN", "CLUB_LEADER", "STUDENT"];

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async listUsers(req) {
    this.ensureAdmin(req);
    return this.userRepository.findAll();
  }

  async getUser(req) {
    this.ensureAdmin(req);
    const user = await this.userRepository.findById(req.params.userId);

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    return user;
  }

  async getProfile(req) {
    const user = await this.userRepository.findById(req.actorId);

    if (!user) {
      throw new AppError(404, "Profile not found.");
    }

    return user;
  }

  async createUser(req) {
    this.ensureAdmin(req);

    const data = this.validateUserPayload(req.body, { requirePassword: true });
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError(409, "A user with this email already exists.");
    }

    return this.userRepository.create(data);
  }

  async updateUser(req) {
    this.ensureAdmin(req);

    const currentUser = await this.userRepository.findById(req.params.userId);

    if (!currentUser) {
      throw new AppError(404, "User not found.");
    }

    const data = this.validateUserPayload(req.body);
    return this.userRepository.update(req.params.userId, data);
  }

  async updateProfile(req) {
    const currentUser = await this.userRepository.findById(req.actorId);

    if (!currentUser) {
      throw new AppError(404, "Profile not found.");
    }

    const data = this.validateProfilePayload(req.body);
    return this.userRepository.update(req.actorId, data);
  }

  async assignRole(req) {
    this.ensureAdmin(req);

    const role = String(req.body.role || "").trim().toUpperCase();

    if (!ROLES.includes(role)) {
      throw new AppError(400, "Invalid role.", { allowedRoles: ROLES });
    }

    const user = await this.userRepository.update(req.params.userId, { role });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    return user;
  }

  async changePassword(req) {
    const user = await this.userRepository.findById(req.actorId);

    if (!user) {
      throw new AppError(404, "Profile not found.");
    }

    const currentPassword = String(req.body.currentPassword || "");
    const newPassword = String(req.body.newPassword || "");

    if (!newPassword || newPassword.length < 6) {
      throw new AppError(400, "New password must be at least 6 characters.");
    }

    if (user.password && user.password !== currentPassword) {
      throw new AppError(400, "Current password is incorrect.");
    }

    await this.userRepository.update(req.actorId, { password: newPassword });
    return { message: "Password changed successfully." };
  }

  async deleteUser(req) {
    this.ensureAdmin(req);

    if (String(req.actorId) === String(req.params.userId)) {
      throw new AppError(400, "Administrators cannot delete their own account.");
    }

    const removed = await this.userRepository.delete(req.params.userId);

    if (!removed) {
      throw new AppError(404, "User not found.");
    }

    return removed;
  }

  ensureAdmin(req) {
    if (!req.isAdmin) {
      throw new AppError(403, "Only administrators can manage user accounts.");
    }
  }

  validateUserPayload(payload, options = {}) {
    const requiredFields = ["name", "email", "role"];
    const missingFields = requiredFields.filter((field) => !String(payload[field] || "").trim());

    if (options.requirePassword && !String(payload.password || "").trim()) {
      missingFields.push("password");
    }

    if (missingFields.length > 0) {
      throw new AppError(400, "Missing required user fields.", { missingFields });
    }

    const role = String(payload.role).trim().toUpperCase();

    if (!ROLES.includes(role)) {
      throw new AppError(400, "Invalid role.", { allowedRoles: ROLES });
    }

    return {
      name: String(payload.name).trim(),
      email: String(payload.email).trim().toLowerCase(),
      role,
      phone: payload.phone ? String(payload.phone).trim() : "",
      department: payload.department ? String(payload.department).trim() : "",
      ...(payload.password ? { password: String(payload.password) } : {}),
    };
  }

  validateProfilePayload(payload) {
    const missingFields = ["name", "email"].filter((field) => !String(payload[field] || "").trim());

    if (missingFields.length > 0) {
      throw new AppError(400, "Missing required profile fields.", { missingFields });
    }

    return {
      name: String(payload.name).trim(),
      email: String(payload.email).trim().toLowerCase(),
      phone: payload.phone ? String(payload.phone).trim() : "",
      department: payload.department ? String(payload.department).trim() : "",
    };
  }
}

module.exports = UserService;
