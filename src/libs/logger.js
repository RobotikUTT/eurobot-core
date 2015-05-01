import winston from 'winston';
import util from 'util';
import {getModuleName} from '../helpers/module';


/**
 * Socket io object
 */
var io = null;
var history = [];


/**
 * Transports through socket io to the control pannel for web debugging
 */
class WebLogger extends winston.Transport {

    constructor(options) {
        super();
        this.name = 'webLogger';
        this.level = options.level || 'info';
    }

    log(level, msg, meta, callback) {
        var message = { level: level, msg: msg, meta: meta };
        history.push(message);

        if (io)
        {
            io.emit('log', message);
            callback(null, true);
        }
    }
}

// Register webLogger to winston
winston.transports.WebLogger = WebLogger;




/**
 * Get a logger including the module path
 * @param  module
 * @return {Object} Logger object
 */
function getLogger(module) {
    var path = getModuleName(module);
    var options = {
        "colorize": true,
        "level": "debug"
    };
    options.path = path;

    var transports = [ new winston.transports.Console(options),
        new WebLogger(options)
    ];

    return new winston.Logger({
        transports: transports
    });
}


/**
 * Set the io object
 *
 * @param  io_ socket.io instance
 */
function initIO(io_) {
    io = io_;
}


/**
 * Global history getter
 * @return {Array} All messages logged since program launch
 */
function getHistory() {
    return history;
}


export default {
        getLogger: getLogger,
        initIO: initIO,
        getHistory: getHistory
};