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
      Motors control listeners
     */

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
      if (data.x && data.y) {
        // TODO
      }
      else if (data.distance) {
        modules.motorController
          .goTo(data.distance)
          .then(() => {
            log.info('goToMotor finished: ' + data.distance);
          })
          .catch((err) => {
            log.warn('goToMotor failed: ' +err);
          });
      }
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


    /*
      Clamp control listeners
     */

    socket.on('updateClamp', function(data) {
      modules.clampController
        .updatePosition()
        .catch((err) => {
          log.warn('stepGetPos failed: ' +err);
        });
    });

    socket.on('clampGoTo', function(data) {
      modules.clampController
        .goTo(data.motor, data.pos)
        .then(() => {
          log.info('Step ' +data.motor+ ' goTo ' +data.pos);
        })
        .catch((err) => {
          log.warn('Step ' +data.motor+ ' goTo ' +data.pos+ 'failed: '+err);
        });
    });

    socket.on('clampStop', function(data) {
      modules.clampController
        .stop(data.motor)
        .then(() => {
          log.info('Clamp ' +data.motor+ ' stopped');
        })
        .catch((err) =>{
          log.warn('Clamp ' +data.motor+ ' stop failed: '+err);
        });
    });

    socket.on('resetClamp', function(data) {
      modules.clampController
        .init('elev')
        .then(() => {
          log.info('Clamp elevator reset');
          return modules.clampController.init('clamp');
        })
        .then(() => {
          log.info('Clamp grab reset');
        })
        .catch((err) =>{
          log.warn('Clamp reset failed: ' +err);
        });
    });


    /*
      Manual control listeners
     */

    socket.on('goForward', function(data) {
      // TODO
    });

    socket.on('turnLeft', function(data) {
      // TODO
    });

    socket.on('goBackward', function(data) {
      // TODO
    });

    socket.on('turnRight', function(data) {
      // TODO
    });

    socket.on('elevatorUp', function(data) {
      // TODO
    });

    socket.on('elevatorDown', function(data) {
      // TODO
    });

    socket.on('clampExpand', function(data) {
      // TODO
    });

    socket.on('clampCompress', function(data) {
      // TODO
    });


    /*
      MotorController settings listeners
     */

    socket.on('motionSettings', function(newSettings) {
      if (!modules.motorController)
        throw new Error("No motorController module bound");

      modules.motorController.setTunings(newSettings.orientation.position,
        newSettings.distance.position, newSettings.distance.dt);

      // TODO: implement others settings
    });

    socket.on('calibrateCenterDistance', function() {
      // TODO
    });

    socket.on('calibrateWheelRadius', function() {
      // TODO
    });

    socket.on('resetOdometry', function() {
      modules.motorController.setOdometry({x: 0, y: 0}, 0)
        .then(() => {
          log.info('Odometry reset');
        })
        .catch((err) => {
          log.warn('resetOdometry: ' +err);
        })
    });


    /*
      Socket.io listeners
     */
    socket.on('disconnect', function() {
      log.info('[WEB] Client disconnected');
    });
});


/*
  Server API
 */

function startWebServer() {
  return server.listen(port);
}

function bindModules(_modules) {
  modules = _modules;


  /*
    Module listeners
   */

  modules.motorController.on('newPosition', function() {
    io.sockets.emit('odometryUpdate', modules.motorController.getPosition());
  });
}


export default {
  start: startWebServer,
  bind: bindModules
};