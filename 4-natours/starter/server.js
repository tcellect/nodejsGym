const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.CONNECTION_STRING_DB.replace(
  "<PASSWORD>",
  process.env.PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected to cluster"));

// here belong configurations not related to express
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on port: ${PORT}...`));
