import * as logger from '../libs/logger';

var promisify = require('native-promisify');
let path      = require('path');
let express   = require('express');
let app       = express().use(express.static(path.join(__dirname, 'public')));
let server    = promisify(require('http').Server(app), ['listen']);
let io        = require('socket.io')(server);
let util      = require('util');


/**
 * Socket io is set up, we can pass the object
 * to the logger module
 */

logger.initIO(io);
let log = logger.getLogger(module);

let port = 8080;

io.on('connection', function(socket) {
    log.info('[WEB] New client connected');

    socket.on('disconnect', function() {
        log.info('[WEB] Client disconnected');
    });
});


/**
 * Start the webServer
 */

export function start() {
    log.info('[WEB] Server listening on *:' + port);

    return server.listen(port);
}