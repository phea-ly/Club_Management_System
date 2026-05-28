class AbstractModel {
    constructor() {
        if (new.target === AbstractModel) {
            throw new Error("AbstractModel cannot be created directly");
        }
    }

    toJSON() {
        throw new Error("Child model must implement toJSON()");
    }
}

module.exports = AbstractModel;
