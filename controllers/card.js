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
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
  .then((card) => {
    if(!card){
      res.status(404).send({message: 'Карточка не существует.'});
      return;
    }
    if(card.owner.toString() === req.user._id){
      Card.deleteOne(card)
      .then((cards) => {
        res.status(200).send({data: cards})
      })
      .catch(next);
    }
    else{
      res.send('Нельзя удалять чужие карточки.')
    }
  })
  .catch((err) => {
    if(err.name === 'CastError'){
      res.status(400).send({message: 'Некорректные данные карточки.'})
    }
    else{
      res.status(500).send('Ошибка на сервере.')
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
