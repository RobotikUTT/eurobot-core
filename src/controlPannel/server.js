import * as logger from '../libs/logger';


let util      = require('util');
var promisify = require('native-promisify');
let path      = require('path');
let express   = require('express');
let app       = express().use(express.static(path.join(__dirname, 'public')));
let server    = promisify(require('http').Server(app), ['listen']);
let io        = require('socket.io')(server);


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
              data.x, data.y, data.forceFace));

        modules.motorController
          .goTo(data.x, data.y, Boolean(data.forceFace))
          .then(() => {
            log.info(util.format('Arrived in (%d, %d) forceFace: %s',
              data.x, data.y, data.forceFace));
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
          log.warn(err.message);
        }
      });


    /*
      Init interface
     */

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