const { bootstrap } = require("./src/app");
const env = require("./src/config/env");

const port = env.port || 3000;

bootstrap()
    .then((app) => {
        app.listen(port, () => {
            console.log(`Club Management System running at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Failed to start application:", error);
        process.exit(1);
    });
