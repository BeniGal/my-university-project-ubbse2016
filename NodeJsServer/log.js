var winston = require('winston');

module.exports = function() {
    winston.configure({
        transports: [
            new winston.transports.Console({
                colorize: true,
                timestamp: true,
                level: 'debug'
            })
        ], exitOnError: false
    });

    winston.info("Logger configured!");
};
