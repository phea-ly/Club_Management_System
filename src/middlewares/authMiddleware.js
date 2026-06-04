const parseCookies = (cookieHeader = "") => {
  return cookieHeader.split(";").reduce((cookies, pair) => {
    const separatorIndex = pair.indexOf("=");

    if (separatorIndex === -1) {
      return cookies;
    }

    const key = pair.slice(0, separatorIndex).trim();
    const value = pair.slice(separatorIndex + 1).trim();

    if (key) {
      cookies[key] = decodeURIComponent(value);
    }

    return cookies;
  }, {});
};

const decodeSession = (sessionValue) => {
  if (!sessionValue) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(sessionValue, "base64url").toString("utf8"));
  } catch (error) {
    return null;
  }
};

const attachUser = (req, res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  const user = decodeSession(cookies.club_session);

  if (user) {
    req.user = user;
    req.userRole = user.role;
  }

  next();
};

const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
    return;
  }

  if (req.accepts("html")) {
    res.redirect("/login");
    return;
  }

  res.status(401).json({
    success: false,
    message: "Please log in to access this action",
  });
};

module.exports = {
  attachUser,
  requireLogin,
  parseCookies,
  decodeSession,
};
