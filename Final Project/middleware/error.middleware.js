// centralized error handler
module.exports = (err, req, res, next) => {
  console.error(err.stack || err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null
  });
};
