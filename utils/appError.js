class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    //* when a new object was created and the constructor function is call, 
    //* that function call will not appear in the stackTrace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError
