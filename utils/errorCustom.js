class errorCustom extends Error {
  constructor(message, statusCode){
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;
    
    this.errors = typeof message === 'object' ? message : null;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = errorCustom;

/*
  this class is only for operational errors, which mean error that might occur and can be predict
 */