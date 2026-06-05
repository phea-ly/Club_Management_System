class UserModel {
  constructor({ id, name, email, role = "STUDENT", phone = "", department = "", password = "" }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.phone = phone;
    this.department = department;
    this.password = password;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    const { password, ...user } = this;
    return user;
  }
}

module.exports = UserModel;
