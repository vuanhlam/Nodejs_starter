const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  reStrictTo,
  logout,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);


/**
 *TODO: from this point line 30
 *! all the route in the bottom gonna be authenticated
 *! because we are using Middleware router.use(protect), and Middleware run in sequence
 *TODO: so before reach to all the apis behind the Middleware router.use(protect) will do it job => authenticated 
*/
router.use(protect);

router.patch('/updateMyPassword', updatePassword); // only authenticated user can update Password

router.get('/me', getMe, getUser)

router.patch('/updateMe', updateMe); // only authenticated user can update profile

router.delete('/deleteMe', deleteMe);

//TODO: after this Middlware only admin have permission to access
router.use(reStrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
