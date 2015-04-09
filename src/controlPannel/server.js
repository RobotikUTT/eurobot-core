import * as logger from '../libs/logger';

var promisify = require('native-promisify');
let path      = require('path');
let express   = require('express');
let app       = express().use(express.static(path.join(__dirname, './')));
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


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + '/public/style.css');
});

app.get('/script.js', function(req, res) {
    res.sendFile(__dirname + '/public/script.js');
});


/**
 * Start the webServer
 */

export function start() {
    log.info('[WEB] Server listening on *:' + port);

    return server.listen(port);
}