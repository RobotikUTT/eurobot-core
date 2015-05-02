import MotorController from './modules/MotorController';
import IA from './IA/IA';
import server from './controlPannel/server';


let log = require('./libs/logger').getLogger(module);

server
    .start()
    .then(function() {
        log.info('[WEB] Server listening on *:8080');
        let modules = {};

        let motorController = new MotorController(0x2);
        modules.motorController = motorController;

        let ia = new IA(modules);
        server.bind(modules);
    })
    .catch(function(err) {
        log.error(err);
    });