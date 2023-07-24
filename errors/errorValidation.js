const { errorValidation } = require('./errors');

class ErrorValidation extends Error {
  constructor(message) {
    super(message);
    this.statusCode = errorValidation;
  }
}
module.exports = ErrorValidation;
