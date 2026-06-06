const crypto = require("crypto");

const DEFAULT_TTL_SECONDS = 60 * 60 * 24;

function base64UrlEncode(value) {
    return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function base64UrlDecode(value) {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function createSessionToken(payload, secret, ttlSeconds = DEFAULT_TTL_SECONDS) {
    if (!secret) {
        throw new Error("Session secret is required");
    }

    const tokenPayload = {
        ...payload,
        exp: Date.now() + ttlSeconds * 1000,
    };

    const encodedPayload = base64UrlEncode(tokenPayload);
    const signature = crypto
        .createHmac("sha256", secret)
        .update(encodedPayload)
        .digest("base64url");

    return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token, secret) {
    if (!token || !secret) {
        return null;
    }

    const [encodedPayload, signature] = token.split(".");

    if (!encodedPayload || !signature) {
        return null;
    }

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(encodedPayload)
        .digest("base64url");

    const received = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);

    if (received.length !== expected.length) {
        return null;
    }

    if (!crypto.timingSafeEqual(received, expected)) {
        return null;
    }

    try {
        const payload = base64UrlDecode(encodedPayload);

        if (!payload.exp || Date.now() > payload.exp) {
            return null;
        }

        return payload;
    } catch (_error) {
        return null;
    }
}

function buildCookie(token, ttlSeconds = DEFAULT_TTL_SECONDS) {
    return [
        `club_auth=${token}`,
        "HttpOnly",
        "Path=/",
        `Max-Age=${ttlSeconds}`,
        "SameSite=Lax",
    ].join("; ");
}

module.exports = {
    DEFAULT_TTL_SECONDS,
    createSessionToken,
    verifySessionToken,
    buildCookie,
};
