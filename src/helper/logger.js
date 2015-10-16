import winston from 'winston';
import mkdirp from 'mkdirp';
import touch from 'touch';

const logPath = './log';
const logName = 'logs.txt';

function init() {
    try {
        // Create log folder
        mkdirp.sync(logPath);
    }
    catch (e) {}

    try {
        // Create log file
        touch.sync(`${logPath}/${logName}`);
    }
    catch (e) {}
}

init();

/**
 * Return a module name given it's instance object
 *
 * @param  {object} module module object
 * @return {String}        module name
 */
function getModuleName(module) {
    return module.filename.split('build/')[1].split('.js')[0];
}


/**
 * Get a logger including the module path
 * @param  module
 * @return {Object} Logger object
 */
export function getLogger(module) {
    let moduleName = getModuleName(module);

    let consoleOpts = {
        colorize: true,
        level: 'debug',
        label: moduleName,
    };

    let fileOpts = {
        colorize: true,
        level: 'debug',
        label: moduleName,
        filename: `${logPath}/logs.txt`,
        json: false,
    };

    let transports = [
        new winston.transports.Console(consoleOpts),
        new winston.transports.File(fileOpts),
    ];

    return new winston.Logger({
        transports: transports,
    });
}
