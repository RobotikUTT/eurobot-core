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
let modules = null;

let port = 8080;
let data = {
  kp: 5,
  ki: 6,
  kd: 7,
  dt: 10,
  items: [
    ['ball',     'Balle',     100],
    ['cylinder', 'Cylindre',  200],
    ['bottle',   'Bouteille', 300],
    ['cube',     'Cube',      400]
  ]
};


io.on('connection', function(socket) {
    log.info('[WEB] New client connected');

    socket.on('disconnect', function() {
        log.info('[WEB] Client disconnected');
    });

    data.messages = logger.getHistory();
    socket.emit('init', data);
});



/**
 * Start the webServer
 */

export function start(modules_) {
    log.info('[WEB] Server listening on *:' + port);

    return server.listen(port);
}

export function bind(modules_) {
    modules = modules_;
}