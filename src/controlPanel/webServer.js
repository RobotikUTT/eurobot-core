import util from 'util';
import path from 'path';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import conf from '../helper/config';
import * as logger from '../helper/logger';

let log     = logger.getLogger(module);
let app     = express().use(express.static(path.join(__dirname, 'public')));
let server  = http.Server(app);
let io      = socketIO(server);


io.on('connection', function(socket) {
    log.info('New client connected');

    socket.on('disconnect', function() {
        log.info('Client disconnected');
    });
});

export function start() {
    let port = conf.get('controlPanel').port;
    server.listen(port);
}
