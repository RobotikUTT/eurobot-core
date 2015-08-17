import util from 'util';
import path from 'path';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import promisify from 'native-promisify';
import logger from '../libs/logger';


let app    = express().use(express.static(path.join(__dirname, 'public')));
let server = promisify(http.Server(app), ['listen']);
let io     = socketIO(server);
let log    = logger.getLogger(module);


/**
 * Socket io is set up, we can pass the object
 * to the logger module
 */


let port    = 8080;
let modules = null;


io.on('connection', function(socket) {
    log.info('[WEB] New client connected');

    /*
      Listeners
     */

    // Control center
      // Motor
    socket.on('stopMotor', function() {
      modules.motorController
        .stop()
        .then(() => {
          log.info('Motors stopped');
        })
        .catch((err) => {
          log.warn('Motors stop failed: '+err);
        });
    });

    socket.on('goToMotor', function(data) {
      modules.motorController
        .goTo(data.distance)
        .then(() => {
          log.info('goToMotor finished: ' + data.distance);
        })
        .catch((err) => {
          log.warn('goToMotor failed: ' +err);
        });
    });

    socket.on('runMotor', function(data) {
      modules.motorController.run(data.motor, data.pwm)
        .then(() => {
          log.info('runMotor '+data.motor+' at '+data.pwm);
        })
        .catch((err) => {
          log.warn('runMotor ' +data.motor+ ' failed: ' +err);
        });
    });

    socket.on('turnMotor', function(data) {
      modules.motorController.turn(data.angle)
        .then(() => {
          log.info('Turn '+data.angle);
        })
        .catch((err) => {
          log.warn('turnMotor failed: ' +err);
        });
    });

    socket.on('resetOdometry', function() {
      modules.motorController.setOdometry({x: 0, y: 0}, 0)
        .then(() => {
          log.info('Odometry reset');
        })
        .catch((err) => {
          log.warn('resetOdometry failed: ' +err);
        })
    });

      // Clamp
    socket.on('stepGetpos', function(data) {
      modules.clampController
        .updatePosition()
        .catch((err) => {
          log.warn('stepGetPos failed: ' +err);
        });
    });

    socket.on('stepGoto', function(data) {
      modules.clampController
        .goTo(data.motor, data.pos)
        .then(() => {
          log.info('Step ' +data.motor+ ' goTo ' +data.pos);
        })
        .catch((err) => {
          log.warn('Step ' +data.motor+ ' goTo ' +data.pos+ 'failed: '+err);
        });
    });

    socket.on('stepStop', function(data) {
      modules.clampController
        .stop(data.motor)
        .then(() => {
          log.info('Step ' +data.motor+ ' stopped');
        })
        .catch((err) =>{
          log.warn('Step ' +data.motor+ ' stop failed: '+err);
        });
    });

    socket.on('stepInit', function(data) {
      modules.clampController
        .init(data.motor)
        .then(() => {
          log.info('Step: '+data.motor+ ' initialized');
        })
        .catch((err) =>{
          log.warn('Step '+data.motor+' init failed: ' +err);
        });
    });

    // Motion settings
    socket.on('motionSettings', function(newSettings) {
      if (!modules.motorController)
        throw new Error("No motorController module bound");

      modules.motorController.setTunings(newSettings.orientation.position,
        newSettings.distance.position, newSettings.distance.dt);

      // TODO: implement others settings
    });

    socket
      .on('disconnect', function() {
        log.info('[WEB] Client disconnected');
      })
});


/*
  API
 */

function startWebServer() {
  return server.listen(port);
}

function bindModules(_modules) {
  modules = _modules;

  // Odometry updates
  modules.motorController.on('newPosition', function() {
    io.sockets.emit('newState', modules.motorController.getPosition());
  });
}


export default {
  start: startWebServer,
  bind: bindModules
};