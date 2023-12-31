const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../errors/errorUnauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorUnauthorized('Вы не авторизовались.');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    next(new ErrorUnauthorized('Вы не авторизовались.'));
  }
  req.user = payload;

  next();
};
