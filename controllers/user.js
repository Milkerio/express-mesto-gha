const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorValidation = require('../errors/errorValidation');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorDefault = require('../errors/errorDefault');
const ErrorUnauthorized = require('../errors/errorUnauthorized');
const ErrorConflict = require('../errors/errorConflict');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден.');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorValidation('Переданы некорректные данные.'));
        return;
      }
      next(err);
    });
};
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    throw new ErrorValidation('Email и пароль обязательны!');
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then(() => res.status(200).send({
          data: {
            name, about, avatar, email,
          },
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ErrorConflict('Пользователь с данным email уже существует.'));
          }
          if (err.name === 'ValidationError') {
            next(new ErrorValidation('Переданы некорретные данные.'));
          }
          next(err);
        });
    })
    .catch(next);
};
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные.'));
      }
      next(err);
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные.'));
      }
      next(err);
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret',
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 3600000 * 24 * 7,
      });
      res.send({ token });
    })
    .catch(() => {
      next(new ErrorUnauthorized('Вы не авторизовались.'));
    });
};
module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден.');
      }
      res.send({ data: user });
    })
    .catch(() => {
      next(ErrorDefault('Произошла ошибка на сервере.'));
    });
};
