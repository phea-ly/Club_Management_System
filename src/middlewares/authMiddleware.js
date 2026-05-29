module.exports = function authMiddleware(req, res, next) {
    const userId = req.headers["x-user-id"] || req.query.userId;
    const role = req.headers["x-user-role"] || req.query.role;

    if (!userId || !role) {
        if (process.env.NODE_ENV !== "production") {
            req.user = {
                id: 1,
                role: "club_leader"
            };

            return next();
        }

        return res.status(401).json({
            success: false,
            message: "Authentication required. Add x-user-id and x-user-role headers, or use ?userId=1&role=club_leader for testing."
        });
    }

    req.user = {
        id: Number(userId),
        role: String(role)
    };

    return next();
};
