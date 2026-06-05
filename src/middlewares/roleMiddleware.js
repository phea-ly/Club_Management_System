const normalizeRole = (role) => {
  if (!role) {
    return "";
  }

  return String(role).trim().toUpperCase();
};

const allowRoles = (...roles) => {
  const allowedRoles = roles.map(normalizeRole);

  return (req, res, next) => {
    const currentRole = normalizeRole(req.userRole || req.headers["x-user-role"]);

    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({
        success: false,
        message: `Only ${allowedRoles.join(" or ")} can access this action`,
      });
    }

    req.userRole = currentRole;
    next();
  };
};

module.exports = {
  allowRoles,
  normalizeRole,
};
