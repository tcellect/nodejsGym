const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

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
const server = app.listen(PORT, () =>
  console.log(`listening on port: ${PORT}...`)
);

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
