const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: "./config.env" });

// here belong configurations not related to express
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on port: ${PORT}...`));
