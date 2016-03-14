/**
 * Created by kyle on 14/3/16.
 */


var winston = require('winston');
winston.emitErrs = true;

/**
 * Pre-define Winston & its transport. For now, every winston log comment will be written to both File & Console.
 * @type {winston.Logger}
 */
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
            timestamp: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: './outputs/logs/error.log'
        })
    ],
    exitOnError: false
});
logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};
module.exports = logger;

