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
    .catch(() => next(ErrorDefault('Произошла ошибка на сервере.')));
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
      } else {
        next(ErrorDefault('Произошла ошибка на сервере.'));
      }
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
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные.'));
      } else if (err.code === 11000) {
        next(new ErrorConflict('Пользователь с данным email уже существует.'));
      } else {
        next(ErrorDefault('Произошла ошибка на сервере.'));
      }
    });
};
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные.'));
      } else {
        next(ErrorDefault('Произошла ошибка на сервере.'));
      }
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
      } else {
        next(ErrorDefault('Произошла ошибка на сервере.'));
      }
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден.');
      } else {
        bcrypt.compare(password, user.password)
          .then((isValid) => {
            if (isValid) {
              const token = jwt.sign({ _id: req.user._id });
              res.cookie('jwt', token, {
                httpOnly: true,
                expiresIn: '7d',
              });
              res.send(user);
            } else {
              throw new ErrorUnauthorized('Вы не авторизовались.');
            }
          })
          .catch(() => {
            next(ErrorDefault('Произошла ошибка на сервере.'));
          });
      }
    })
    .catch(() => {
      next(ErrorDefault('Произошла ошибка на сервере.'));
    });
};
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден.');
      } else {
        res.send(user);
      }
    })
    .catch(() => {
      next(ErrorDefault('Произошла ошибка на сервере.'));
    });
};
