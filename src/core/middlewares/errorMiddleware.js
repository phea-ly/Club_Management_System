const AppError = require("../errors/AppError");

function errorMiddleware(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Internal Server Error" });
}

module.exports = errorMiddleware;
