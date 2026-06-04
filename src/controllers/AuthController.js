const authService = require("../services/AuthService");
const renderLoginPage = require("../views/auth/login");

const ONE_DAY_SECONDS = 24 * 60 * 60;

const encodeSession = (user) => {
  return Buffer.from(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })).toString("base64url");
};

const getSafeRedirect = (redirect) => {
  if (typeof redirect === "string" && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }

  return "/dashboard";
};

class AuthController {
  showLogin(req, res) {
    res.send(renderLoginPage(req.query.error || "", getSafeRedirect(req.query.redirect)));
  }

  login(req, res) {
    try {
      const user = authService.login(req.body.email, req.body.password);
      res.cookie("club_session", encodeSession(user), {
        httpOnly: true,
        maxAge: ONE_DAY_SECONDS * 1000,
        sameSite: "lax",
      });
      res.redirect(getSafeRedirect(req.body.redirect));
    } catch (error) {
      res.status(401).send(renderLoginPage(error.message, getSafeRedirect(req.body.redirect)));
    }
  }

  logout(req, res) {
    res.clearCookie("club_session");
    res.redirect("/login");
  }
}

module.exports = new AuthController();
