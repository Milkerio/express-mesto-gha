const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateAvatar,
  updateProfile,
} = require('../controllers/user');

router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
