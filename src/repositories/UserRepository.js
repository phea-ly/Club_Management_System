const UserModel = require("../models/UserModel");

class UserRepository {
  constructor() {
    if (!UserRepository.users) {
      UserRepository.users = [
        new UserModel({
          id: 1,
          name: "System Administrator",
          email: "admin@example.com",
          role: "ADMIN",
          phone: "012345678",
          department: "Administration",
          password: "admin123",
        }),
        new UserModel({
          id: 2,
          name: "Student User",
          email: "student@example.com",
          role: "STUDENT",
          phone: "098765432",
          department: "Computer Science",
          password: "student123",
        }),
      ];
      UserRepository.nextId = 3;
    }
  }

  async findAll() {
    return UserRepository.users;
  }

  async findById(id) {
    return UserRepository.users.find((user) => user.id === Number(id)) || null;
  }

  async findByEmail(email) {
    return (
      UserRepository.users.find(
        (user) => user.email.toLowerCase() === String(email).trim().toLowerCase()
      ) || null
    );
  }

  async create(data) {
    const user = new UserModel({
      id: UserRepository.nextId,
      ...data,
    });

    UserRepository.nextId += 1;
    UserRepository.users.push(user);
    return user;
  }

  async update(id, data) {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    Object.assign(user, data, {
      updatedAt: new Date().toISOString(),
    });

    return user;
  }

  async delete(id) {
    const index = UserRepository.users.findIndex((user) => user.id === Number(id));

    if (index === -1) {
      return null;
    }

    const [removed] = UserRepository.users.splice(index, 1);
    return removed;
  }
}

module.exports = UserRepository;
