import MotorController from './modules/MotorController';
import IA from './IA/IA';
import * as controlPannel from './controlPannel/server';

let log = require('./libs/logger').getLogger(module);


controlPannel
    .start()
    .then(function() {
        // let motorController = new MotorController(0x2);
        // let ia = new IA(motorController);

        // ia.start();
    });
