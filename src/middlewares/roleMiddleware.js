const { sendUnauthorized } = require("./authMiddleware");

function wantsHtml(req) {
    const accept = String(req.headers.accept || "").toLowerCase();
    return accept.includes("text/html");
}

function sendForbidden(req, res, message = "You are not allowed to access this resource") {
    if (wantsHtml(req)) {
        return res.status(403).send(`
            <h1>403</h1>
            <p>${message}</p>
            <a href="/">Go back</a>
        `);
    }

    return res.status(403).json({
        success: false,
        message,
    });
}

function normalizeRole(role) {
    return typeof role === "string" ? role.trim().toLowerCase() : "";
}

function requireRoles(...roles) {
    const allowedRoles = roles.map(normalizeRole);

    return (req, res, next) => {
        if (!req.user) {
            return sendUnauthorized(req, res);
        }

        const currentRole = normalizeRole(req.user.role);

        if (!allowedRoles.includes(currentRole)) {
            return sendForbidden(req, res, `Only ${roles.join(" or ")} can access this action`);
        }

        return next();
    };
}

function requireSelfOrRoles(userIdParam, ...roles) {
    const allowedRoles = roles.map(normalizeRole);

    return (req, res, next) => {
        if (!req.user) {
            return sendUnauthorized(req, res);
        }

        const isOwner = String(req.params[userIdParam]) === String(req.user.id);
        const currentRole = normalizeRole(req.user.role);

        if (isOwner || allowedRoles.includes(currentRole)) {
            return next();
        }

        return sendForbidden(req, res);
    };
}

module.exports = {
    requireRoles,
    requireSelfOrRoles,
};
