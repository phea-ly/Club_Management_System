const userService = require("../services/UserService");

const sendSuccess = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

const getErrorStatus = (error) => {
  return error.message.includes("not found") ? 404 : 400;
};

class UserController {
  getUsers(req, res) {
    const users = userService.getUsers();
    sendSuccess(res, 200, users, "Users retrieved successfully");
  }

  provisionUser(req, res) {
    try {
      const user = userService.provisionUser(req.body);
      sendSuccess(res, 201, user, "User provisioned successfully");
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }

  assignRole(req, res) {
    try {
      const user = userService.assignRole(req.params.id, req.body.role);
      sendSuccess(res, 200, user, "User role assigned successfully");
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }

  resetPassword(req, res) {
    try {
      const user = userService.resetPassword(req.params.id, req.body.password);
      sendSuccess(res, 200, user, "Password reset successfully");
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }
}

module.exports = new UserController();
