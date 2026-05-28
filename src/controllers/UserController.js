const AbstractController = require("../core/base/AbstractController");
const userListView = require("../views/users/userListView");
const userFormView = require("../views/users/userFormView");
const profileView = require("../views/users/profileView");
const passwordView = require("../views/users/passwordView");

class UserController extends AbstractController {
    constructor(userService) {
        super();
        this.userService = userService;
    }

    index = async (req, res) => {
        try {
            const users = await this.userService.getAllUsers();
            return res.send(userListView(users));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    createForm = async (req, res) => {
        try {
            return res.send(userFormView({
                title: "Create User",
                action: "/users",
                showPassword: true
            }));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    store = async (req, res) => {
        try {
            await this.userService.createUser(req.body);
            return res.redirect("/users");
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    editForm = async (req, res) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            return res.send(userFormView({
                user,
                title: "Edit User",
                action: `/users/${user.id}`,
                showPassword: false
            }));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    update = async (req, res) => {
        try {
            await this.userService.updateUser(req.params.id, req.body);
            return res.redirect("/users");
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    assignRole = async (req, res) => {
        try {
            await this.userService.assignRole(req.params.id, req.body.role);
            return res.redirect("/users");
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    profileForm = async (req, res) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            return res.send(profileView(user));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    updateProfile = async (req, res) => {
        try {
            await this.userService.updateProfile(req.params.id, req.body);
            return res.redirect("/users");
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    passwordForm = async (req, res) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            return res.send(passwordView(user));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    changePassword = async (req, res) => {
        try {
            await this.userService.changePassword(req.params.id, req.body);
            return res.redirect("/users");
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    destroy = async (req, res) => {
        try {
            await this.userService.deleteUser(req.params.id);
            return res.redirect("/users");
        } catch (error) {
            return this.handleError(res, error);
        }
    };
}

module.exports = new UserController(require("../services/UserService"));
module.exports.UserController = UserController;
