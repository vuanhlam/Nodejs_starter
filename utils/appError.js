class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    /**
     *! All the error that we wil create using this class will always be operational error
     *! so Error that we can predict will happen at some point in the future 
     *! from now we will always use this AppError class to create all the error in our Application
     ** The property isOperational using for test to only send error message back to the client 
    */
    this.isOperational = true;

    //* when a new object was created and the constructor function is called
    //* and that function call will not appear in the stackTrace
    Error.captureStackTrace(this, this.constructor);
  }
}   

module.exports = AppError
