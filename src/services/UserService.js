const UserRepository = require("../repositories/UserRepository");

class UserService {
    constructor(userRepository = new UserRepository()) {
        this.userRepository = userRepository;
    }

    async getUsers() {
        const users = await this.userRepository.findAll();

        return {
            success: true,
            users
        };
    }
}

module.exports = UserService;
