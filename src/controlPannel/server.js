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

const UPDATE_STATUS_PERIOD = 110; //ms


let port = 8080;
let data = {
  distance: {
    kp: 0.9,
    ki: 0,
    kd: 0.1
  },
  orientation: {
    kp: 2.3,
    ki: 0,
    kd: 0.25
  },
  dt: 50,
  items: [
    // ['ball',     'Balle',     100],
    // ['cylinder', 'Cylindre',  200],
    // ['bottle',   'Bouteille', 300],
    // ['cube',     'Cube',      400]
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
        console.log(data);
        modules.motorController.setTunings(data.orientation, data.distance, data.dt)
          .then(() => {
            log.info('Tunings set');
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
      })
      /*
        Step motors/Clamp
      */
      .on('stepGetpos', function(data) {
        modules.clampController.updatePosition()
        .catch((err) =>{log.warn(err.message);});
      })
      .on('stepGoto', function(data) {
        modules.clampController.goTo(data.motor, data.pos)
        .catch((err) =>{log.warn(err.message);});
      })
      .on('stepStop', function(data) {
        modules.clampController.stop(data.motor)
        .catch((err) =>{log.warn(err.message);});
      })
      .on('stepInit', function(data) {
        modules.clampController.init(data.motor)
        .catch((err) =>{log.warn(err.message);});
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

      //Update status icons
      let motorStatus = false;
      setInterval(() => {
        modules.motorController.isAlive()
        .then(() => {
          if(!motorStatus) {
            socket.emit('updateStatus', {board : 'motor', status : true});
            motorStatus = true;
          }
        })
        .catch(() => {
          if(motorStatus) {
            socket.emit('updateStatus', {board : 'motor', status : false});
            motorStatus = false;
          }
        });
      }, UPDATE_STATUS_PERIOD);

    }

    if (modules.clampController)
    {
      // Odometry updates
      modules.clampController.on('clampPos', function(data) {
        io.sockets.emit('clampPos', data);
      });

      //Update status icons
      let clampStatus = false;
      setInterval(() => {
        modules.clampController.isAlive()
        .then(() => {
          if(!status.clamp) {
            socket.emit('updateStatus', {board : 'clamp', status : true});
            status.clamp = true;
          }
        })
        .catch(() => {
          if(status.clamp) {
            socket.emit('updateStatus', {board : 'clamp', status : false});
            status.clamp = false;
          }
        });
      }, UPDATE_STATUS_PERIOD);
    }

    if (modules.sensorsController)
    {
      //Update status icons
      let sensorStatus = false;
      setInterval(() => {
        modules.sensorController.isAlive()
        .then(() => {
          if(!status.sensor) {
            socket.emit('updateStatus', {board : 'sensor', status : true});
            status.sensor = true;
          }
        })
        .catch(() => {
          if(status.sensor) {
            socket.emit('updateStatus', {board : 'sensor', status : false});
            status.sensor = false;
          }
        });
      }, UPDATE_STATUS_PERIOD);
    }
}


export default {
  start: start,
  bind: bind
};
