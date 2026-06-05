const { bootstrap } = require("./src/app");
const env = require("./src/config/env");

const basePort = Number(env.port) || 3000;
const maxPortAttempts = 25;

async function startServer(app, preferredPort) {
    const attempts = [];

    for (let offset = 0; offset < maxPortAttempts; offset += 1) {
        attempts.push(preferredPort + offset);
    }

    for (const port of attempts) {
        const started = await new Promise((resolve) => {
            const server = app.listen(port);

            server.once("listening", () => {
                const address = server.address();
                resolve({ ok: true, port, server, address });
            });

            server.once("error", (error) => {
                if (error.code === "EADDRINUSE") {
                    server.close(() => resolve({ ok: false, port }));
                    return;
                }

                resolve({ ok: false, port, error });
            });
        });

        if (started.ok) {
            const actualPort = started.address && typeof started.address === "object"
                ? started.address.port
                : port;

            if (actualPort !== basePort) {
                console.log(`Port ${basePort} is busy, using ${actualPort} instead.`);
            }

            console.log(`Club Management System running at http://localhost:${actualPort}`);
            return started.server;
        }

        if (started.error) {
            throw started.error;
        }
    }

    throw new Error(`Unable to find a free port between ${basePort} and ${basePort + maxPortAttempts - 1}`);
}

async function start() {
    try {
        const app = await bootstrap();
        await startServer(app, basePort);
    } catch (error) {
        console.error("Failed to start application:", error);
        process.exit(1);
    }
}

start();
