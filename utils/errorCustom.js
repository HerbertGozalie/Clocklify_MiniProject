class errorCustom extends Error {
  constructor(message, statusCode){
    super(message);
    this.statusCode = statusCode || 500;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = typeof message === 'object' ? message : null;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = errorCustom;