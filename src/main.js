import MotorController from './modules/MotorController';
import IA from './IA/IA';
import server from './controlPannel/server';


let log = require('./libs/logger').getLogger(module);

server
    .start()
    .then(function() {
        let modules = {};

        let motorController = new MotorController(0x2);
        modules.motorController = motorController;

        let ia = new IA(modules);
        server.bind(modules);
    });