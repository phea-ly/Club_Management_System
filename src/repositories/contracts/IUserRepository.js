class IUserRepository {
    constructor() {
        if (new.target === IUserRepository) {
            throw new Error("IUserRepository is an interface and cannot be created directly");
        }
    }

    async findByEmail() {
        throw new Error("Repository must implement findByEmail()");
    }

    async updatePassword() {
        throw new Error("Repository must implement updatePassword()");
    }

    async assignRole() {
        throw new Error("Repository must implement assignRole()");
    }
}

module.exports = IUserRepository;
