import util from 'util';
import path from 'path';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import tmxParser from 'tmx-parser';
import promisify from 'native-promisify';
import logger from '../libs/logger';


let app       = express().use(express.static(path.join(__dirname, 'public')));
let server    = promisify(http.Server(app), ['listen']);
let io        = socketIO(server);
let tmx       = promisify(tmxParser);


/**
 * Socket io is set up, we can pass the object
 * to the logger module
 */

logger.initIO(io);
let log = logger.getLogger(module);
let modules = null;

let port = 8080;
let data = {
  kp: 0,
  ki: 0,
  kd: 0,
  dt: 50,
  items: [
    ['ball',     'Balle',     100],
    ['cylinder', 'Cylindre',  200],
    ['bottle',   'Bouteille', 300],
    ['cube',     'Cube',      400]
  ]
};


io.on('connection', function(socket) {
    log.info('[WEB] New client connected');

    /*
      Setup handlers
     */

    socket
      .on('disconnect', function() {
        log.info('[WEB] Client disconnected');
      })

      .on('stopMotor', function() {
        log.info('stopMotor request');

        modules.motorController
          .stop()
          .then(() => {
            log.info('Motors stopped');
          })
          .catch((err) => {
            log.warn(err.message);
          });
      })

      .on('goToMotor', function(data) {
        log.info(util.format('goToMotor request (%d, %d) forceFace: %s',
              data.point.x, data.point.y, data.forceFace));

        modules.motorController
          .goTo(data.point, Boolean(data.forceFace))
          .then(() => {
            log.info(util.format('Arrived in (%d, %d) forceFace: %s',
              data.point.x, data.point.y, data.forceFace));
          })
          .catch((err) => {
            log.warn(err.message);
          });
      })

      .on('runMotor', function(data) {
        modules.motorController.run(data.motor, data.pwm)
          .then(() => {
            log.info(util.format('%s run at %d', data.motor, data.pwm));
          })
          .catch((err) => {
            log.warn(err.message);
          });
      })

      .on('turnMotor', function(data) {
        modules.motorController.turn(data.angle)
          .then(() => {
            log.info(util.format('Tun %d', data.angle));
          })
          .catch((err) => {
            log.warn(err.message);
          });
      })

      .on('setTunings', function(data) {
        modules.motorController.setTunings(data.kp, data.ki, data.kd, data.dt)
          .then(() => {
            log.info(util.format('Tunings set to kp:%d, ki:%d, kd:%d, dt:%d',
              data.kp, data.ki, data.kd, data.dt));
          })
          .catch((err) => {
            log.warn(err.message);
          })
      })

      .on('resetOdometry', function() {
        modules.motorController.setOdometry({x: 0, y: 0}, 0)
          .then(() => {
            log.info('Odometry reset');
          })
          .catch((err) => {
            log.warn(err.message);
          })
      })

      .on('eval', function(data) {
        /*
          Shortcuts
         */

        let help = 'Not yet !';
        let m = modules;

        try {
          log.info('[EVAL]: ' + eval(data));
        }
        catch(err) {
          log.warn('[EVAL]: ' + err.message);
        }
      });

    /*
      Init interface
     */

    data.messages = logger.getHistory();
    socket.emit('init', data);

    tmx.parseFile(path.join(__dirname, 'public/ROBOT.tmx'))
      .then(function(map) {
        socket.emit('map', {map: {width: map.width, height:map.height, tileWidth: map.tileWidth, tileHeight: map.tileHeight}, tiles: map.layers[0].tiles, tileSet: map.tileSets[0]});
      })
      .catch(function(err) {
        log.error('[MAP]: ' + err.message);
      });
});


/**
 * Start the webServer
 */

function start(modules_) {
    log.info('[WEB] Server listening on *:' + port);

    return server.listen(port);
}

function bind(modules_) {
    modules = modules_;

    if (modules.motorController)
    {
      // Odometry updates
      modules.motorController.on('newPosition', function() {
        io.sockets.emit('getPosition', modules.motorController.getPosition());
      });
    }
}


export default {
  start: start,
  bind: bind
};