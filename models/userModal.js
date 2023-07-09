const moongoose = require('mongoose');
const validator = require('validator');

const userSchema = new moongoose.Schema({
  name: {
    type: String,
    require: [true, 'A user must have a name']
  },
  email: {
    type: String,
    require: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    require: [true, 'Password is not allowed empty'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    require: [true, 'confirmPassword is not allowed empty'],
    minlength: 8
  }
});

const User = moongoose.model('User', userSchema);

module.exports = User;
