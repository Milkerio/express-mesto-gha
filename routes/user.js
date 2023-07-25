const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { validateUrl } = require('../validation/urlValidation');

const {
  getAllUsers,
  getUserById,
  updateAvatar,
  updateProfile,
  getUserInfo,
} = require('../controllers/user');

router.get('/users', getAllUsers);
router.get('/users/me', getUserInfo);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required().hex(),
  }),
}), getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateUrl),
  }),
}), updateAvatar);

module.exports = router;
