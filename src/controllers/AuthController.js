const authService = require("../services/AuthService");
const { clearAuthCookie } = require("../middlewares/authMiddleware");
const loginView = require("../views/auth/loginView");

function sanitizeRedirectTarget(value) {
    const target = String(value || "").trim();

    if (!target) {
        return "";
    }

    if (!target.startsWith("/") || target.startsWith("//")) {
        return "";
    }

    return target;
}

function getLoginRedirect(user) {
    const role = String(user.role || "").toLowerCase();

    if (role === "admin") {
        return "/users";
    }

    if (role === "club_leader") {
        return "/clubs";
    }

    return `/profile/${user.id}`;
}

class AuthController {
    showLoginForm = (req, res) => {
        if (req.user) {
            return res.redirect(getLoginRedirect(req.user));
        }

        return res.send(loginView({
            error: req.query.error ? String(req.query.error) : "",
            returnTo: req.query.returnTo ? String(req.query.returnTo) : "",
        }));
    };

    login = async (req, res) => {
        try {
            const result = await authService.login(req.body.email, req.body.password);

            res.setHeader("Set-Cookie", result.cookie);

            const redirectTo = sanitizeRedirectTarget(req.body.returnTo)
                || sanitizeRedirectTarget(req.query.returnTo)
                || getLoginRedirect(result.user);
            return res.redirect(redirectTo);
        } catch (error) {
            const message = error.message || "Unable to log in";
            const wantsHtml = String(req.headers.accept || "").toLowerCase().includes("text/html");

            if (wantsHtml) {
                return res.status(error.statusCode || 400).send(loginView({
                    error: message,
                    returnTo: sanitizeRedirectTarget(req.body.returnTo) || sanitizeRedirectTarget(req.query.returnTo) || "",
                }));
            }

            return res.status(error.statusCode || 400).json({
                success: false,
                message,
            });
        }
    };

    logout = (req, res) => {
        clearAuthCookie(res);

        if (String(req.headers.accept || "").toLowerCase().includes("text/html")) {
            return res.redirect("/auth/login");
        }

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    };

    me = (req, res) => {
        return res.json({
            success: true,
            data: req.user || null,
        });
    };
}

module.exports = new AuthController();
module.exports.AuthController = AuthController;
