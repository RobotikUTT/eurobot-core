import MotorController from './modules/MotorController';
import * as controlPannel from './controlPannel/server';


controlPannel.start();
var motorController = new MotorController(0x2);

setInterval(function() {
    motorController.bus.i2cWrite(0x02, 1, new Buffer([56]))
        .then(function() {

            console.log("0 byte sent");
        })
        .catch(function(err) {
            console.log(err);
        });

    console.log("Sending 0...");
}, 1000);
