function authMiddleware(req, res, next) {
  const actorId = req.header("x-user-id");

  if (!actorId) {
    return res.status(401).json({ error: "Unauthorized. Missing X-User-Id header." });
  }

  req.actorId = actorId;
  req.isAdmin = req.header("x-user-role") === "ADMIN";
  next();
}

module.exports = authMiddleware;
