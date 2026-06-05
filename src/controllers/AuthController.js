const authService = require("../services/AuthService");

const ONE_DAY_SECONDS = 24 * 60 * 60;

const encodeSession = (user) => {
  return Buffer.from(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })).toString("base64url");
};

class AuthController {
  login(req, res) {
    try {
      const user = authService.login(req.body.email, req.body.password);
      res.cookie("club_session", encodeSession(user), {
        httpOnly: true,
        maxAge: ONE_DAY_SECONDS * 1000,
        sameSite: "lax",
      });
      res.json({
        success: true,
        message: "Login successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  logout(req, res) {
    res.clearCookie("club_session");
    res.json({
      success: true,
      message: "Logout successful",
    });
  }
}

module.exports = new AuthController();
