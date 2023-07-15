const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
  .then((cards) => res.send(cards))
  .catch((err) => res.send(`Произошла ошибка ${err}`))
}
module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;
  Card.create({name, link, owner})
  .then((card) => res.send(card))
  .catch((err) => {
    if(err.name === 'ValidationError'){
      res.status(400).send({ message: 'Переданы некорректные данные.'})
    }
    else {
      res.status(500).send({message: 'Произошла ошибка на сервере.'})
    }
  })
}
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if(card.owner === req.user._id){
      card.deleteOne(card)
      .then((cards) => res.send(cards))
      .catch((err) => res.send(`Произошла ошибка ${err}`))
    }
    else {
      res.send('Нельзя удалять чужие карточки.')
    }
  })
  .catch((err) => {
    if(err.name === 'CastError'){
      res.status(404).send({ message: 'Карточка не найдена.'})
    }
    else {
      res.status(500).send({message: 'Произошла ошибка на сервере.'})
    }
  })
}
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$addToSet: {likes: req.user._id}}, { new: true })
  .then((card) => res.send(card))
  .catch((err) => {
    if(err.name === 'CastError'){
      res.status(404).send({ message: 'Карточка не найдена.'})
    }
    else {
      res.status(500).send({message: 'Произошла ошибка на сервере.'})
    }
  })
}
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$pull: { likes: req.user._id } }, { new: true })
  .then((card) => res.send(card))
  .catch((err) => {
    if(err.name === 'CastError'){
      res.status(404).send({ message: 'Карточка не найдена.'})
    }
    else {
      res.status(500).send({message: 'Произошла ошибка на сервере.'})
    }
  })
}
