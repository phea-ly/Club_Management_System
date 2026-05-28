# User Management OOP Notes

This feature is organized by clean architecture layers:

- Model: `UserModel`, `AdminUser`, and `UserFactory`
- Repository: `UserRepository`
- Service: `UserService` and `PasswordService`
- Controller: `UserController`
- Routes: `userRoutes` and `profileRoutes`
- Views: files in `src/views/users`

OOP concepts used:

- Abstraction: `AbstractModel`, `AbstractRepository`, `AbstractService`, and `AbstractController` define common structure.
- Interface: `IUserRepository` acts like a JavaScript interface by listing required repository methods.
- Inheritance: `AdminUser` extends `UserModel`.
- Polymorphism: `AdminUser` overrides `canManageUsers()` and `getDisplayName()`.
- Encapsulation: `UserModel` stores data in private fields such as `#id`, `#name`, and `#email`.

Main user requirements covered:

- Administrators can create user accounts.
- Administrators can update users and assign roles.
- Users can update profile information.
- Users can change passwords.

The service layer uses `async/await` and validation. The controller layer uses `try/catch` to handle errors.
