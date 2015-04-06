import MotorController from './modules/MotorController';
import * as controlPannel from './controlPannel/server';


// controlPannel.start();
var motorController = new MotorController(0x2);

motorController.init()
    .then(function() {
        console.log('Connected to motorController');
    })
    .catch(function(err) {
        console.log(err.stack);
    });
