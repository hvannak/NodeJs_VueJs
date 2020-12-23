const winston = require('winston');
var path = require('path');

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    defaultMeta: { service: 'user-interact' },
    transports: [
      new winston.transports.File({ filename: path.resolve('logs') + '\\' + 'app_error.log', level: 'error' }),
    ],
  });

module.exports = {
    logger:logger
}