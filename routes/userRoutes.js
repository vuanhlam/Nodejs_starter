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
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword); // only authenticated user can update Password


router.get('/me', protect, getMe, getUser)
router.patch('/updateMe', protect, updateMe); // only authenticated user can update profile
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
