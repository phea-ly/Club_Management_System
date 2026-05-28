class AbstractRepository {
    constructor() {
        if (new.target === AbstractRepository) {
            throw new Error("AbstractRepository cannot be created directly");
        }
    }

    async findAll() {
        throw new Error("Repository must implement findAll()");
    }

    async findById() {
        throw new Error("Repository must implement findById()");
    }

    async create() {
        throw new Error("Repository must implement create()");
    }

    async update() {
        throw new Error("Repository must implement update()");
    }

    async delete() {
        throw new Error("Repository must implement delete()");
    }
}

module.exports = AbstractRepository;
