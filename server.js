const app = require("./src/app");
const env = require("./src/config/env");

const port = env.port || 5000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
