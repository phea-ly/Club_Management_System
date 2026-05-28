const ROLES = {
    ADMIN: "ADMIN",
    CLUB_LEADER: "CLUB_LEADER",
    MEMBER: "MEMBER"
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        next();
    };
};

module.exports = { authorize, ROLES };
