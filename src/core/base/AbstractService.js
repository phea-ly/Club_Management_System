class AbstractService {
    constructor() {
        if (new.target === AbstractService) {
            throw new Error("AbstractService cannot be created directly");
        }
    }
}

module.exports = AbstractService;
