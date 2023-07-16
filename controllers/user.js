const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
  .then((users) => res.send({data: users}))
  .catch((err) => res.status(500).send({message: 'Произошла ошибка.'}))
}
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
  .then((user) => {
    if(!user){
      res.status(404).send({message: 'Пользователь не найден.'})
    }
    else{
      res.send({data: user});
    }
  })
  .catch((err) => {
    if(err.name === 'CastError'){
      res.status(400).send({ message: 'Пользователь не найден.'})
    }
    else {
      res.status(500).send({message: 'Произошла ошибка на сервере.'})
    }
  })
}
module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
  .then((user) => res.send({data: user}))
  .catch((err) => {
    if(err.name === 'ValidationError'){
      res.status(400).send({ message: 'Переданы некорректные данные.'})
    }
    else {
      res.status(500).send({message: 'Произошла ошибка на сервере.'})
    }
  })
}
module.exports.updateProfile = (req, res) => {
  const {name, about} = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, {name, about})
  .then((user) => res.send({data: user}))
  .catch((err) => {
    if(err.name === 'ValidationError'){
      res.status(400).send({ message: 'Переданы некорректные данные.'})
    }
    else {
      res.status(500).send({message: 'Произошла ошибка на сервере.'})
    }
  })
}
module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, {avatar})
  .then((user) => res.send({data: user}))
  .catch((err) => {
    if(err.name === 'ValidationError'){
      res.status(400).send({ message: 'Переданы некорректные данные.'})
    }
    else {
      res.status(500).send({message: 'Произошла ошибка на сервере.'})
    }
  })
}
