const { errorUnathorized } = require('./errors');

class ErrorUnathorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = errorUnathorized;
  }
}
module.exports = ErrorUnathorized;
