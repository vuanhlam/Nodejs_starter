/* eslint-disable import/order */
/* eslint-disable arrow-body-style */
/* eslint-disable import/no-extraneous-dependencies */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // convert to milisecond 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // cookie can not be accessed or modify in anyway by the browser
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // the cookie only be send on encrypted connection -> https

  res.cookie('jwt', token, cookieOptions);

  // Remove password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  /**
   *! the mistake of this code is that, we create a new user using all the data in the req.body
   *! so the problem here is everyone can specify the role as an admin
   */
  // const newUser = await User.create(req.body);

  /**
   *TODO: Fixed
   */
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('User is not exists', 401));
  }

  //* because instance method correctPassword() is defined in the userModal is available on all the document
  //* so the user above is a document and it's can call to that function
  const correct = await user.correctPassword(password, user.password);

  if (!correct) {
    return next(new AppError('Incorrect email or password', 401)); // 401 unauthorized
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //TODO (1) Getting token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not login! Please log in to get Access.', 401)
    );
  }

  //TODO (2) Verification the token -> compare test signature and original signature
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // if error happen it will return an Invalid signature or JsonWebTokenError

  //TODO (3) Check if user still exists
  /**
   *! Why need to be check if user still exists
   *! - What if the user has been deleted in the meantime, so the token still exits, but the user is no longer in existence
   *! then we don't want to log them in
   */
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belong to this token no longer exist.', 401)
    );
  }

  //TODO (4) Check if user changed password after the token was issued
  /**
   *! - What if user has actually changed his password after the token was created, well that token should also not work anymore
   *! for example someone stole token from a user, so all token that was issued before the password changed so longer be valid
   */
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed  password! Please log in again.', 401)
    );
  }

  //TODO (5) GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;

  next();
});

//* Only for rendered pages, no errors!
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    //TODO (1) Verification the token -> compare test signature and original signature
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    ); // if error happen it will return an Invalid signature or JsonWebTokenError

    //TODO (2) Check if user still exists
    /**
     *! Why need to be check if user still exists
     *! - What if the user has been deleted in the meantime, so the token still exits, but the user is no longer in existence
     *! then we don't want to log them in
     */
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }

    //TODO (3) Check if user changed password after the token was issued
    /**
     *! - What if user has actually changed his password after the token was created, well that token should also not work anymore
     *! for example someone stole token from a user, so all token that was issued before the password changed so longer be valid
     */
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    //TODO (5) THERE IS A LOGGED IN USER
    // eslint-disable-next-line no-unused-expressions
    res.locals.user = currentUser;
    return next();
  }
  next();
});

exports.reStrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permisson to perform this action', 403)
      ); //403 forbidden , for authorization basically
    }
    next();
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //TODO (1) Get user based on Posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404)); // 404 not found
  }

  //TODO (2) Generate the random token
  const resetToken = await user.createPasswordResetToken();
  /**
   *! we do not need validate data because we just need save some new field like passwordResetExpires
   *! so use { validateBeforeSave: false } to skip validate
   */
  await user.save({ validateBeforeSave: false });

  //TODO (3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to : ${resetURL}.\nIf you did'n forget your password, pleage ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      messae: 'token sent to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email, try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //TODO (1) get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //TODO (2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400)); //400 bad request
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  /**
   *! with this one we don't use { validateBeforeSave: false }
   *! because we need validate password and passwordConfirm before save
   */
  await user.save();

  //TODO (3) Update changedPasswordAt property for the user
  //* implement in userModal using pre save hook (moongoose Middleware)

  //TODO (4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //TODO (1) Get user from the collection
  const user = await User.findById(req.user.id).select('+password'); // req.user get from Middleware protect

  //TODO (2) Check if posted current password is correct
  const isCorrect = await user.correctPassword(
    req.body.passwordCurrent,
    user.password
  );
  if (!isCorrect)
    return next(new AppError('Your current password is wrong.', 401)); // 401 unauthorized

  //TODO (3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  /**
   *! Why we can not use findByIdAndUpdate
   *! In userModal some function (pre save Middleware relevant with password) and validator will not work with findByIdAndUpdate
   */

  //TODO (4) Log user in, send JWT
  createSendToken(user, 200, res);
});
