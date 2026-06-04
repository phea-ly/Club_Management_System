const { randomBytes, randomUUID, scryptSync, timingSafeEqual } = require("crypto");
const AppError = require("../core/errors/AppError");

const ROLE_ALIASES = {
  ADMIN: "ADMIN",
  LEADER: "LEADER",
  CLUB_LEADER: "LEADER",
  MEMBER: "MEMBER",
  STUDENT: "MEMBER",
};

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async listUsers(req) {
    this.assertAdmin(req);
    return this.userRepository.findAll();
  }

  async getUser(req) {
    const { userId } = req.params;
    this.assertAdminOrSelf(req, userId);

    const user = await this.userRepository.findPublicById(userId);
    if (!user) throw new AppError(404, "User not found.");

    return user;
  }

  async getProfile(req) {
    const user = await this.userRepository.findPublicById(req.actorId);
    if (!user) throw new AppError(404, "User not found.");

    return user;
  }

  async createUser(req) {
    this.assertAdmin(req);

    const body = req.body;
    const email = this.normalizeEmail(body.email);
    const password = this.requiredText(body.password, "Password");

    if (password.length < 6) {
      throw new AppError(400, "Password must be at least 6 characters.");
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new AppError(400, "Email is already registered.");

    const role = await this.findRole(body.role || "MEMBER");
    const user = {
      id: randomUUID(),
      first_name: this.requiredText(body.first_name, "First name"),
      last_name: this.requiredText(body.last_name, "Last name"),
      email,
      password_hash: this.hashPassword(password),
      role_id: role.id,
      is_active: body.is_active === undefined ? 1 : Number(Boolean(body.is_active)),
      created_at: this.toMysqlDateTime(new Date()),
    };

    return this.userRepository.create(user);
  }

  async updateUser(req) {
    const { userId } = req.params;
    this.assertAdminOrSelf(req, userId);

    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError(404, "User not found.");

    const changes = await this.buildUserChanges(req);
    await this.assertUniqueEmail(changes.email, userId);

    return this.userRepository.update(userId, changes);
  }

  async updateProfile(req) {
    const user = await this.userRepository.findById(req.actorId);
    if (!user) throw new AppError(404, "User not found.");

    const changes = this.profileChanges(req.body);
    await this.assertUniqueEmail(changes.email, req.actorId);

    return this.userRepository.update(req.actorId, changes);
  }

  async assignRole(req) {
    this.assertAdmin(req);

    const { userId } = req.params;
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError(404, "User not found.");

    const role = await this.findRole(req.body.role);
    return this.userRepository.update(userId, { role_id: role.id });
  }

  async changePassword(req) {
    const user = await this.userRepository.findById(req.actorId);
    if (!user) throw new AppError(404, "User not found.");

    const currentPassword = this.requiredText(req.body.current_password, "Current password");
    const newPassword = this.requiredText(req.body.new_password, "New password");

    if (newPassword.length < 6) {
      throw new AppError(400, "New password must be at least 6 characters.");
    }

    if (!this.verifyPassword(currentPassword, user.password_hash)) {
      throw new AppError(400, "Current password is incorrect.");
    }

    await this.userRepository.updatePassword(req.actorId, this.hashPassword(newPassword));
    return { changed: true };
  }

  async deleteUser(req) {
    this.assertAdmin(req);

    const { userId } = req.params;
    if (userId === req.actorId) {
      throw new AppError(400, "Administrators cannot deactivate their own account.");
    }

    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError(404, "User not found.");

    return this.userRepository.deactivateById(userId);
  }

  async buildUserChanges(req) {
    const changes = this.profileChanges(req.body);

    if (req.body.role !== undefined) {
      this.assertAdmin(req);
      changes.role_id = (await this.findRole(req.body.role)).id;
    }

    if (req.body.is_active !== undefined) {
      this.assertAdmin(req);
      changes.is_active = Number(Boolean(req.body.is_active));
    }

    return changes;
  }

  profileChanges(body) {
    const changes = {};

    if (body.first_name !== undefined) {
      changes.first_name = this.requiredText(body.first_name, "First name");
    }
    if (body.last_name !== undefined) {
      changes.last_name = this.requiredText(body.last_name, "Last name");
    }
    if (body.email !== undefined) {
      changes.email = this.normalizeEmail(body.email);
    }

    return changes;
  }

  async assertUniqueEmail(email, userId) {
    if (!email) return;

    const existing = await this.userRepository.findByEmail(email);
    if (existing && existing.id !== userId) {
      throw new AppError(400, "Email is already registered.");
    }
  }

  assertAdmin(req) {
    if (!req.isAdmin) {
      throw new AppError(403, "Access denied. Administrator role is required.");
    }
  }

  assertAdminOrSelf(req, userId) {
    if (!req.isAdmin && req.actorId !== userId) {
      throw new AppError(403, "Access denied.");
    }
  }

  normalizeEmail(email) {
    const normalized = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!normalized) throw new AppError(400, "Email is required.");
    return normalized;
  }

  normalizeRoleName(role) {
    const normalized = ROLE_ALIASES[String(role || "").trim().toUpperCase()];
    if (!normalized) {
      throw new AppError(400, "Invalid user role.", {
        allowed: ["ADMIN", "LEADER", "MEMBER"],
      });
    }
    return normalized;
  }

  async findRole(role) {
    const normalized = this.normalizeRoleName(role);
    const record = await this.userRepository.findRoleByName(normalized);
    if (!record) throw new AppError(404, "Role not found.");
    return record;
  }

  requiredText(value, name) {
    if (typeof value !== "string" || !value.trim()) {
      throw new AppError(400, `${name} is required.`);
    }
    return value.trim();
  }

  hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `scrypt:${salt}:${hash}`;
  }

  verifyPassword(password, storedPassword) {
    if (!storedPassword) return false;

    const [scheme, salt, storedHash] = String(storedPassword).split(":");
    if (scheme !== "scrypt" || !salt || !storedHash) {
      return password === storedPassword;
    }

    const hashBuffer = Buffer.from(storedHash, "hex");
    const suppliedBuffer = scryptSync(password, salt, 64);
    return hashBuffer.length === suppliedBuffer.length && timingSafeEqual(hashBuffer, suppliedBuffer);
  }

  toMysqlDateTime(date) {
    return date.toISOString().slice(0, 19).replace("T", " ");
  }
}

module.exports = UserService;
