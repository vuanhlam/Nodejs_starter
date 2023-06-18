const dotenv = require('dotenv');

/**
 *! dotenv variable will read our config.env file
 *! and save the variables into node.js environment variables
 */
dotenv.config({ path: './config.env' }); // define config before app because we need to read the Environment variables before the app starts
const app = require('./app');

/**
 *! environment variables are global variables that are used to define the evironment in which is node.js app is running
 *! but nodejs itself actually set a lot of environment variables
*/
// console.log(app.get('env')); // this is set by express

/**
 *! this is the environment which is set by nodejs 
*/
 console.log(process.env); // this is set by nodejs

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
