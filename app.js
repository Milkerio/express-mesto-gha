const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const ErrorNotFound = require('./errors/errorNotFound');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(require('./routes/authorize'));

app.use('/', auth, require('./routes/user'));
app.use('/', auth, require('./routes/card'));

app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Данного пути не сущетсвует.'));
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});
app.listen(PORT);
