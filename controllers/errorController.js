const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err, res) => {
  /**
   ** if new error was created by class AppError so that is will gonna be an Operational error
   ** if the error wasn't created by class AppError so that something might wrong and send back to client general error message 
  */
  if (err.isOperational) {
    //* Operational error : send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //* Programming error or Unkown error: don't leak error detail to clients 
    console.error('ERROR', err)
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const handleCatchErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400); // 400: bad request 
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = {...err};
    if(error.name === 'CastError') {
      error = handleCatchErrorDB(error)
    }
    sendErrorProduction(error, res);
  }
};
