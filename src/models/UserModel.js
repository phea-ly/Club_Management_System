class User {
  constructor({
    id,
    name,
    email,
    role,
    password,
    isActive = true,
    createdAt,
    updatedAt,
    passwordResetAt = null,
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.password = password;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.passwordResetAt = passwordResetAt;
  }
}

module.exports = User;
