/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

/**
 *! app.js is usually mainly use for Middleware declaration
 *! we have all the Middleware that we want to apply to all the routes
 */
const app = express();

//TODO (1) GLOBAL MIDDLEWARE

//* ---- Set security HTTP Headers ----
app.use(helmet())


//* ---- Limit requests from the same api ----
/**
 *! how many requests per IP going to allowed in a certain amount of time
 *! the above mean: allow 100 request from the same IP in 1 hour
 */
 const limiter = rateLimit({
  max: 2,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//* ---- Body parser, reading data from the body into req.body ----
app.use(express.json({
  limit: '10kb' // limit the amount of data that come from the body
}));

//* ---- Development logging ----
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//* ---- Serving static files ----
app.use(express.static(`${__dirname}/public`));

//* ---- Test  middleware ----
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//TODO (2) ROUTER
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

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  /**
   *! this time we use next in a special way
   ** We need to pass the error in to next()
   *! so if the next function receipt an argument no matter what it is
   *! Express will automaticlly know that there were an error
   * TODO - whenever we pass anything into next it will assump that it is an error,
   * TODO - it will then skipp all the orther middleware in the Midllware stack and
   * TODO - send the error that we pass in to global error hanlding Middleware
   */
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

/**
 *! Error Handling Middleware have four arguments
 *! By specify four parameters Express automatically recognized as an error handling middleware
 *! There for only call it when there is an error
 */
app.use(globalErrorHandler);

module.exports = app;
