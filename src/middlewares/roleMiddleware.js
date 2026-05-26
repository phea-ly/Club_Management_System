const ROLES = {
    ADMIN: "admin",
    CLUB_LEADER: "club_leader",
    MEMBER: "member"
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        next();
    };
};

module.exports = { authorize, ROLES };
