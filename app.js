const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');


app.use('/', require('./routes/user'));
app.use((req, res, next) => {
  req.user ={
    _id: '64b30eab77a279e45ef51cb5'
  };
  next();
});
app.use('/', require('./routes/card'));


app.listen(PORT);