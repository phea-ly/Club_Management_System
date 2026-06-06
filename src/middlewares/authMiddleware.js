const env = require("../config/env");
const userRepository = require("../repositories/UserRepository");
const UnauthorizedError = require("../core/errors/UnauthorizedError");
const { verifySessionToken } = require("../utils/sessionToken");

function parseCookies(cookieHeader = "") {
    return cookieHeader.split(";").reduce((cookies, cookiePart) => {
        const [rawKey, ...rawValue] = cookiePart.trim().split("=");

        if (!rawKey) {
            return cookies;
        }

        cookies[rawKey] = decodeURIComponent(rawValue.join("=") || "");
        return cookies;
    }, {});
}

function getTokenFromRequest(req) {
    const authorization = req.headers.authorization || "";

    if (authorization.toLowerCase().startsWith("bearer ")) {
        return authorization.slice(7).trim();
    }

    const cookies = parseCookies(req.headers.cookie || "");
    return cookies.club_auth || null;
}

function wantsHtml(req) {
    const accept = String(req.headers.accept || "").toLowerCase();
    return accept.includes("text/html");
}

function sendUnauthorized(req, res, message = "Please log in to continue") {
    if (wantsHtml(req)) {
        const returnTo = encodeURIComponent(req.originalUrl || "/");
        return res.redirect(`/auth/login?returnTo=${returnTo}`);
    }

    return res.status(401).json({
        success: false,
        message,
    });
}

async function loadCurrentUser(req, _res, next) {
    try {
        const token = getTokenFromRequest(req);
        const payload = verifySessionToken(token, env.jwtSecret);

        if (!payload) {
            req.user = null;
            return next();
        }

        const user = await userRepository.findById(payload.userId);

        if (!user) {
            req.user = null;
            return next();
        }

        req.user = user.toJSON();
        return next();
    } catch (error) {
        return next(error);
    }
}

function requireAuth(req, res, next) {
    if (!req.user) {
        return sendUnauthorized(req, res);
    }

    return next();
}

function requireAuthOrThrow(req, res, next) {
    if (!req.user) {
        return next(new UnauthorizedError("Please log in to continue"));
    }

    return next();
}

function clearAuthCookie(res) {
    res.setHeader("Set-Cookie", "club_auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
}

module.exports = {
    loadCurrentUser,
    requireAuth,
    requireAuthOrThrow,
    sendUnauthorized,
    clearAuthCookie,
    getTokenFromRequest,
};
