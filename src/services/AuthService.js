const bcrypt = require("bcryptjs");
const UserRepository = require("../repositories/UserRepository");

class AuthService {
    constructor(userRepository = new UserRepository()) {
        this.userRepository = userRepository;
    }

    async register(data) {
        const firstName = data.firstName?.trim();
        const lastName = data.lastName?.trim();
        const email = data.email?.trim();
        const password = data.password?.trim();
        const roleName = "MEMBER";

        if (!firstName || !lastName || !email || !password) {
            return {
                statusCode: 400,
                body: {
                    success: false,
                    message: "All fields are required"
                }
            };
        }

        if (password.length < 6) {
            return {
                statusCode: 400,
                body: {
                    success: false,
                    message: "Password must be at least 6 characters"
                }
            };
        }

        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            return {
                statusCode: 409,
                body: {
                    success: false,
                    message: "Email already registered"
                }
            };
        }

        const role = await this.userRepository.findRoleByName(roleName);

        if (!role) {
            return {
                statusCode: 500,
                body: {
                    success: false,
                    message: "Role not found"
                }
            };
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await this.userRepository.create({
            firstName,
            lastName,
            email,
            passwordHash,
            roleId: role.id
        });

        return {
            statusCode: 201,
            body: {
                success: true,
                message: "register successfully"
            }
        };
    }

    async login(data) {
        const email = data.email?.trim();
        const password = data.password?.trim();

        if (!email || !password) {
            return {
                statusCode: 400,
                body: {
                    success: false,
                    message: "Email and password are required"
                }
            };
        }

        const user = await this.userRepository.findActiveByEmail(email);
        const isPasswordCorrect = user && await bcrypt.compare(password, user.password_hash);

        if (!isPasswordCorrect) {
            return {
                statusCode: 401,
                body: {
                    success: false,
                    message: "your password incorrect"
                }
            };
        }

        return {
            statusCode: 200,
            body: {
                success: true,
                message: "login successfully",
                user: {
                    id: user.id,
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    role: user.role
                }
            }
        };
    }
}

module.exports = AuthService;
