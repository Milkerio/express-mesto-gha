const User = require('../models/user');
const { errorValidation, errorDefault, errorNotFound } = require('../errors/errors');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(errorDefault).send({ message: 'Произошла ошибка.' }));
};
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(errorNotFound).send({ message: 'Пользователь не найден.' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorValidation).send({ message: 'Пользователь не найден.' });
      } else {
        res.status(errorDefault).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorValidation).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(errorDefault).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorValidation).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(errorDefault).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorValidation).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(errorDefault).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};
