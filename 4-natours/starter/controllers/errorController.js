const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (err) => {
  const message = `duplicate name: ${err.keyValue.name}`;
  return new AppError(message, 400);
};

const handleValidationErrorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input data ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const errorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

const errorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // operational error: send message to the client
    errorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // preserve original error
    let error = { ...err };

    // internal error error: send message to the client
    console.error(err);
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsErrorDB(error);
    errorProd(error, res);
  }
};

module.exports = globalErrorHandler;
