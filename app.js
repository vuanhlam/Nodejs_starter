/* eslint-disable prettier/prettier */
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

const app = express();

// 1) MIDDLEWARE
/**
 *! app.js is usually mainly use for Middleware declaration
 *! we have all the Middleware that we want to apply to all the routes
 */
app.use(express.json());

// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  /**
   *! if don't call next() the request/response cycle will be stuck in this point
   *! we would not be able to move on and never can send back the response to the client
   */
  next();
});

// 2) ROUTER
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/**
 *! app.all() is a special method that is going to run for all the http methods
 *! that is get, post, patch, delete, etc
 ** this should be the last middleware
 */
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = 'fail'
  err.statusCode = 404;

  /**
   *! this time we use next in a special way
   ** We need to pass the error in to next()
   *! so if the next function receipt an argument no matter what it is 
   *! Express will automaticlly know that there were an error 
   * TODO - whenever we pass anything into next it will assump that it is an error, 
   * TODO - it will then skipp all the orther middleware in the Midllware stack and
   * TODO - send the error that we pass in to global error hanlding Middleware  
  */
  next(err)
});


/**
 *! Error Handling Middleware have four arguments
 *! By specify four parameters Express automatically recognized as an error handling middleware 
 *! There for only call it when there is an error 
*/
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error'
  
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
});

module.exports = app;
