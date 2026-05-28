const AbstractModel = require("../core/base/AbstractModel");

class UserModel extends AbstractModel {
    #id;
    #name;
    #email;
    #role;
    #phone;
    #address;
    #createdAt;
    #updatedAt;

    constructor({ id = null, name, email, role = "member", phone = "", address = "", createdAt = null, updatedAt = null }) {
        super();
        this.#id = id;
        this.#name = name;
        this.#email = email;
        this.#role = role;
        this.#phone = phone;
        this.#address = address;
        this.#createdAt = createdAt;
        this.#updatedAt = updatedAt;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get email() {
        return this.#email;
    }

    get role() {
        return this.#role;
    }

    get phone() {
        return this.#phone;
    }

    get address() {
        return this.#address;
    }

    updateProfile({ name, phone, address }) {
        if (name !== undefined) this.#name = name;
        if (phone !== undefined) this.#phone = phone;
        if (address !== undefined) this.#address = address;
    }

    assignRole(role) {
        this.#role = role;
    }

    canManageUsers() {
        return false;
    }

    getDisplayName() {
        return `${this.#name} (${this.#role})`;
    }

    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            email: this.#email,
            role: this.#role,
            phone: this.#phone,
            address: this.#address,
            createdAt: this.#createdAt,
            updatedAt: this.#updatedAt
        };
    }
}

class AdminUser extends UserModel {
    constructor(data) {
        super({ ...data, role: "admin" });
    }

    canManageUsers() {
        return true;
    }

    getDisplayName() {
        return `Admin: ${this.name}`;
    }
}

class UserFactory {
    static create(data) {
        if (data.role === "admin") {
            return new AdminUser(data);
        }

        return new UserModel(data);
    }
}

module.exports = {
    UserModel,
    AdminUser,
    UserFactory
};
