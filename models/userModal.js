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
    select: false, // never show password as an output
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
  passwordChangedAt: Date 
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

/**
 ** this function is called instance method
 *! An Instance method is basically method that gonna be available on all the document of a certain Collection
 */
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//* Instance methods 
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) { // JWTTimestamp which seted when the token was issued
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp
  }

  return false; // not change password after token was created 
};

const User = moongoose.model('User', userSchema);

module.exports = User;
