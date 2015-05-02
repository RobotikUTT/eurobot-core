import MotorController from './modules/MotorController';
import ClampController from './modules/ClampController';
import IA from './IA/IA';
import server from './controlPannel/server';


let log = require('./libs/logger').getLogger(module);

server
    .start()
    .then(function() {
        let modules = {};

        let motorController = new MotorController(0x2, 11);
        modules.motorController = motorController;

        let clampController = new ClampController(0x3, 13);
        modules.clampController = clampController;

        let ia = new IA(modules);
        server.bind(modules);
    });