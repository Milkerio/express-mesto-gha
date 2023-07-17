const Card = require('../models/card');
const { errorValidation, errorDefault, errorNotFound } = require('../errors/errors');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(errorDefault).send('Произошла ошибка на сервере.'));
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorValidation).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(errorDefault).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(errorNotFound).send({ message: 'Карточка не существует.' });
        return;
      }
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card)
          .then((cards) => {
            res.send({ data: cards });
          })
          .catch(next);
      } else {
        res.send('Нельзя удалять чужие карточки.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorValidation).send({ message: 'Некорректные данные карточки.' });
      } else {
        res.status(errorDefault).send('Ошибка на сервере.');
      }
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(errorNotFound).send({ message: 'Карточка не найдена.' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorValidation).send({ message: 'Карточка не найдена.' });
      } else {
        res.status(errorDefault).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(errorNotFound).send({ message: 'Карточка не найдена.' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorValidation).send({ message: 'Карточка не найдена.' });
      } else {
        res.status(errorDefault).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};
