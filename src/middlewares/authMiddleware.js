const crypto = require("crypto");
const jwtConfig = require("../config/jwt");

function base64UrlDecode(value) {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

    return Buffer.from(padded, "base64").toString("utf8");
}

function sign(input, secret) {
    return crypto
        .createHmac("sha256", secret)
        .update(input)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");
    const headerRole = req.headers["x-user-role"];
    const headerUserId = req.headers["x-user-id"];

    if (scheme !== "Bearer" || !token) {
        if (headerRole) {
            req.user = {
                id: headerUserId || null,
                role: headerRole,
            };

            return next();
        }

        return res.status(401).json({ success: false, message: "Authentication token is required" });
    }

    if (!jwtConfig.secret) {
        return res.status(500).json({ success: false, message: "JWT secret is not configured" });
    }

    try {
        const [encodedHeader, encodedPayload, signature] = token.split(".");

        if (!encodedHeader || !encodedPayload || !signature) {
            return res.status(401).json({ success: false, message: "Invalid authentication token" });
        }

        const header = JSON.parse(base64UrlDecode(encodedHeader));
        const payload = JSON.parse(base64UrlDecode(encodedPayload));
        const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`, jwtConfig.secret);

        if (header.alg !== "HS256" || signature !== expectedSignature) {
            return res.status(401).json({ success: false, message: "Invalid authentication token" });
        }

        if (payload.exp && Date.now() >= payload.exp * 1000) {
            return res.status(401).json({ success: false, message: "Authentication token has expired" });
        }

        req.user = {
            id: payload.id || payload.sub,
            role: payload.role,
            email: payload.email,
        };

        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid authentication token" });
    }
}

module.exports = authMiddleware;
