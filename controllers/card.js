const Card = require('../models/card');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
  .then((cards) => res.send(cards))
  .catch((err) => res.send(`Произошла ошибка ${err}`))
}
module.exports.createCard = (req, res) => {
  const {name, link} = req.body;

  Card.create({name, link, owner: req.user._id})
  .then((card) => res.status(200).send(card))
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
  Card.findById(req.params.cardId)
  .orFail(() => {
    res.status(404).send('Карточка не найдена.')
  })
  .then((card) => {
    if(!card.owner.toString() === req.user._id){
      res.status(400).send('Нельзя удалять чужие карточки.')
    }
    else {
      Сard.deleteOne(card)
      .then(() => res.status(200).send({data: card}))
      .catch((err) => res.send(`Произошла ошибка ${err}`))
    }
  })
  .catch((err) => {
    if(err.name === 'CastError'){
      res.status(400).send({ message: 'Карточка не найдена.'})
    }
    else {
      res.status(500).send({message: 'Произошла ошибка на сервере.'})
    }
  })
}
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$addToSet: {likes: req.user._id}}, { new: true })
  .then((card) => {
    if(!card){
      res.status(404).send({message: 'Карточка не найдена.'})
    }
    res.send(card)
  })
  .catch((err) => {
    if(err.name === 'CastError'){
      res.status(400).send({ message: 'Карточка не найдена.'})
    }
    else {
      res.status(500).send({message: 'Произошла ошибка на сервере.'})
    }
  })
}
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$pull: { likes: req.user._id } }, { new: true })
  .then((card) => {
    if(!card){
      res.status(404).send({message: 'Карточка не найдена.'})
    }
    res.send(card)
  })
  .catch((err) => {
    if(err.name === 'CastError'){
      res.status(400).send({ message: 'Карточка не найдена.'})
    }
    else {
      res.status(500).send({message: 'Произошла ошибка на сервере.'})
    }
  })
}
