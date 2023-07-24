const errorsHandler = (err, req, res, next) => {
  const { errorStatus = 500 } = err.statusCode;
  const errorMessage = errorStatus === 500 ? 'Произошла ошибка на сервере.' : err.message;

  res.status(errorStatus).send({ errorMessage });
  next();
};
module.exports = { errorsHandler };
