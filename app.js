const express = require('express');
const fs = require('fs'); 
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes')
const tourRouter = require('./routes/tourRoutes')

const app = express();

// 1) MIDDLEWARE
/**
 *! app.js is usually mainly use for Middleware declaration 
 *! we have all the Middleware that we want to apply to all the routes 
*/
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the Middleware');
  /**
   *! if don't call next() the request/response cycle will be stuck in this point
   *! we would not be able to move on and never can send back the response to the client
   */
  next();
});
 
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


// 2) ROUTER
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


module.exports = app;
