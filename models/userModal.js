const moongoose = require('mongoose');
const validator = require('validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');

const userSchema = new moongoose.Schema({
  name: {
    type: String,
    require: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    require: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    require: [true, 'Password is not allowed empty'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'confirmPassword is not allowed empty'],
    minlength: 8,

    //! Customize validator
    validate: {
      //this only works on CREATE and SAVE!!!
      validator: function (el) {
        return this.password === el;
      },
      message: 'Password are not the same!',
    },
  },
});

/**
 *! Using moongose Middleware, encryt password
 *! Only run this function if password was actually modified
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  //! Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //! Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

const User = moongoose.model('User', userSchema);

module.exports = User;
