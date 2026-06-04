const fs = require("fs");
const path = require("path");
const User = require("../models/UserModel");

const dataDir = path.join(__dirname, "../data");
const dataFile = path.join(dataDir, "users.json");

class UserRepository {
  constructor() {
    this.ensureStore();
  }

  ensureStore() {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, "[]");
    }
  }

  readAll() {
    this.ensureStore();
    const users = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    return users.map((user) => new User(user));
  }

  writeAll(users) {
    this.ensureStore();
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
  }

  findAll() {
    return this.readAll();
  }

  findActive() {
    return this.readAll().filter((user) => user.isActive);
  }

  findById(id) {
    return this.readAll().find((user) => user.id === id);
  }

  findByEmail(email) {
    if (!email) {
      return undefined;
    }

    const normalizedEmail = email.trim().toLowerCase();
    return this.readAll().find(
      (user) => user.email.trim().toLowerCase() === normalizedEmail
    );
  }

  create(data) {
    const users = this.readAll();
    const now = new Date().toISOString();
    const user = new User({
      id: Date.now().toString(),
      ...data,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    users.push(user);
    this.writeAll(users);
    return user;
  }

  update(id, data) {
    const users = this.readAll();
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return null;
    }

    users[index] = new User({
      ...users[index],
      ...data,
      id: users[index].id,
      createdAt: users[index].createdAt,
      updatedAt: new Date().toISOString(),
    });

    this.writeAll(users);
    return users[index];
  }
}

module.exports = new UserRepository();
