const express = require("express");
const morgan = require("morgan");
const toursRouter = require("./routs/toursRouter");
const usersRouter = require("./routs/usersRouter");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

// this file is a root for express related stuff
const app = express();

// middleware is every function along the way of getting a req, and sending a res
// so order of calling functions matters a lot
// without next function the req/res cycle will stuck
// resulting in not sending anything back
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
});

// mount routers
app.use("/api/v1/tours/", toursRouter);
app.use("/api/v1/users/", usersRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// error handling middleware
// express recognizes that signature as error handling function
app.use(globalErrorHandler);

module.exports = app;
