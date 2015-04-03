import MotorController from './modules/MotorController';
import * as controlPannel from './controlPannel/server';


controlPannel.start();
var motorController = new MotorController(0x2);

setInterval(function() {
	//Test : Send a valid packet to the slave
	let buf = new Buffer([0x42, 0x01, 0x01, 0x42])
    motorController.bus.i2cWrite(0x02, buf.length, buf )
        .then(function() {

            console.log("0 byte sent");
        })
        .catch(function(err) {
            console.log(err);
        });

    console.log("Sending 0...");
}, 1000);
