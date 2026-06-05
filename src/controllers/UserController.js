const UserService = require("../services/UserService");
const UserRepository = require("../repositories/UserRepository");

const userService = new UserService(new UserRepository());

class UserController {
  async list(req, res, next) {
    try {
      const users = await userService.listUsers(req);
      return res.json({ users });
    } catch (error) {
      return next(error);
    }
  }

  async show(req, res, next) {
    try {
      const user = await userService.getUser(req);
      return res.json({ user });
    } catch (error) {
      return next(error);
    }
  }

  async profile(req, res, next) {
    try {
      const user = await userService.getProfile(req);
      return res.json({ user });
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await userService.createUser(req);
      return res.status(201).json({ user });
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await userService.updateUser(req);
      return res.json({ user });
    } catch (error) {
      return next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req);
      return res.json({ user });
    } catch (error) {
      return next(error);
    }
  }

  async assignRole(req, res, next) {
    try {
      const user = await userService.assignRole(req);
      return res.json({ user });
    } catch (error) {
      return next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const result = await userService.changePassword(req);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const removed = await userService.deleteUser(req);
      return res.json({ removed });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UserController();
