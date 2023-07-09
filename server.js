/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('uncaught Exception');
  console.log(err);
  process.exit(1);
});

/**
 *! dotenv variable will read our config.env file
 *! and save the variables into node.js environment variables
 */
dotenv.config({ path: './config.env' }); // define config before app because we need to read the Environment variables before the app starts
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

/**
 *! - mongoose is all about Modal, a Modal is like a blue print (bản thiết kế)
 *! - like a classes in Javascript
 *! - We create a Modal and mongoose in order to create a document using it
 *! - to query, update and delete document
 ** to create a Modal we actually need a Schema
 ** we use this Schema to describle data, to set default value, to validate the data
 */

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// TODO: Listen unhandledRejection allow handle all the error that accur in asynchronous code
/**
 *! Errors Outside Unhandled Rejections
 *! each time that there is an Unhandled Rejections some where in our application
 *! the process Object will emit an Object call Unhandled Rejections and so we can subcrible to that event
 ** just like this
 */
process.on('unhandledRejection', (err) => {
  console.log(' Unhandled Rejections ');
  console.log(err);

  //* close the server after done, it will run the callback function
  //* by doing server.close() we give the server time to finish all the request that are still pending or being handle at the time
  //* and only after that server is closed
  server.close(() => {
    process.exit(1);
  });
});
