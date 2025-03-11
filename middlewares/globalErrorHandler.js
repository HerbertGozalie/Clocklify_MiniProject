module.exports = (err, req, res, next) => {
  console.error(err.stack)

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error'; // for handle client error or server error

  res.status(err.statusCode).json({
    status: err.status,
    errors: err.errors || {message : err.message},
  });
} 