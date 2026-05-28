class AbstractController {
    constructor() {
        if (new.target === AbstractController) {
            throw new Error("AbstractController cannot be created directly");
        }
    }

    handleError(res, error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).send(`
            <h1>${statusCode}</h1>
            <p>${error.message || "Something went wrong"}</p>
            <a href="/users">Back to users</a>
        `);
    }
}

module.exports = AbstractController;
