module.exports = (fn) => (req, res, next) => {
  // express assumes that whatever is passed into next() is an error
  // it will be catched by app.use(globalErrorHandler)
  fn(req, res, next).catch(next);
};
