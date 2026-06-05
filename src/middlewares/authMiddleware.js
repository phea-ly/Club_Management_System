function authMiddleware(req, res, next) {
  const actorId = req.header("x-user-id");

  if (!actorId) {
    return res.status(401).json({ error: "Unauthorized. Missing X-User-Id header." });
  }

  const role = String(req.header("x-user-role") || "STUDENT").trim().toUpperCase();

  req.actorId = actorId;
  req.role = role;
  req.isAdmin = role === "ADMIN";
  next();
}

module.exports = authMiddleware;
