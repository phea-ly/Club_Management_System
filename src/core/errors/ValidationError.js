const AppError = require("./AppError");

class ValidationError extends AppError {
    constructor(message = "Invalid data") {
        super(message, 400);
    }
}

module.exports = ValidationError;
