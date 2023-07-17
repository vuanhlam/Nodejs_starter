const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
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
      //this only works on CREATE and SAVE!!!, if using findByIdAndUpdate it not gonna work 
      validator: function (el) {
        return this.password === el;
      },
      message: 'Password are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
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



userSchema.pre('save', function (next) {
  /**
   *! if password was not modified then not set property passwordChangedAt
   *! what about creating a new document, the first time the document was created, not modified 
   */
  if (!this.isModified('password') || this.isNew) return next();

  /**
   *! sometime saving to the database is slower than creating new token  
   *! making it so the changePassword timestamp is sometime set a bit after the jwt has been created  
  */
  this.passwordChangedAt = Date.now() - 1000;
  next();
});



/**
 ** this function is called instance method
 *! An Instance method is basically method that gonna be available on all the document of a certain Collection
 */
userSchema.methods.correctPassword = async function (
  candidatePassword, //  pass need to be checked 
  userPassword // pass of user in database
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//* Instance methods
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // JWTTimestamp which seted when the token was issued
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  return false; // not change password after token was create d
};

//* Instance methods
userSchema.methods.createPasswordResetToken = function () {
  /**
   *! the token gonna be send to the user, like a reset password
   *! can not save resetToken directly to the database, if hacker got this plain resetToken then it's not good, so we need to hash the token
   */
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'); // hash resetToken to save to the database

  // console.log({resetToken}, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minute

  return resetToken;
};

const User = moongoose.model('User', userSchema);

module.exports = User;
