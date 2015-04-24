import Communication from '../communication/Communication';
import MovePacket from '../communication/packets/MovePacket';
import MotorStopPacket from '../communication/packets/MotorStopPacket';
import MotorRunPacket from '../communication/packets/MotorRunPacket';
import TurnPacket from '../communication/packets/TurnPacket';
import TuningsPacket from '../communication/packets/TuningsPacket';
import SetOdometryPacket from '../communication/packets/SetOdometryPacket';
import * as random from '../helpers/random';

let log = require('../libs/logger').getLogger(module);



const GOTO_TIMEOUT = 15 * 1000; //ms


/**
 * Interface with eurobot-motorController module
 * over I²C
 */
class MotorController {

    /**
     * Constructor
     * @param  {Int} address I2C slave address
     */
    constructor(address) {
        try {
            this.communication = new Communication(address, 11);
            this.communication.open();
        }
        catch(err) {
            if (err.message.indexOf('ENOENT') != -1) {
                log.error('MotorController: I2C bus unavailable');
            }
            else {
                log.error('Cannot connect to motorController: ' + err);
            }
        }
    }


    init() {
        // Avoid overflow when incrementing
        let number1 = random.randRange(0, 254);
        let number2 = random.randRange(-128, 126);
        let number3 = random.randRange(0, 65536);
        let number4 = random.randRange(-32768, 33766);

        return this.ping(number1, number2, number3, number4);
    }


    /**
     * Test communication with the module
     * All four number will be incremented
     * @param {UInt8}  number1 first number
     * @param {Int8}   number2 second number
     * @param {UInt16} number3 third number
     * @param {Int16}  number4 forth number
     * @return {Promise}  reolved with the new nember sent back by the module
     */
    ping(number1, number2, number3, number4) {
        log.debug('Ping !');

        return this.communication.request(0, number1, number2, number3, number4)
            .then(function(packet) {
                if (!(number1 === packet.number1-1 && number2 === packet.number2-1 &&
                    number3 === packet.number3-1 && number4 === packet.number4-1)) {
                    throw new Error('Ping test failed');
                }
            });
    }


    /**
     * Make the robot go to a (x,y) point
     * @param {Object} point Carthesian coordinates. x,y {Int16}
     * @param  {Bool} forceFace set to true if the robot must go front
     * @return {Promise}           resolved when the robot finished.
     * rejected after a GOTO_TIMEOUT milliseconds timeout.
     */
    goTo(point, forceFace) {
        log.debug('goTo !');

        let movePacket = new MovePacket(point, forceFace);

        return this.communication.send(movePacket)
            .then(() => {
                return new Promise((resolve, reject) => {
                    let resolved = false;

                    // Rising dataAvailable means that enslavement is finished
                    this.communication.on('data', function() {
                        log.info('info !');
                        resolve();
                    });

                    // Timeout on enslavement
                    setTimeout(function() {
                        if (!resolved) {
                            reject(new Error('goTo timeout'));
                        }
                    }, GOTO_TIMEOUT);
                });
            });
    }


    getPosition() {
        return this.communication.request(2)
            .then(function(packet) {
                let status = packet.getPoint();
                status.orientation = packet.getOrientation();

                return Promise.resolve(status);
            });
    }


    stop() {
        log.debug('stop !');

        let stopPacket = new MotorStopPacket();

        return this.communication.send(stopPacket);
    }


    run(motor, pwm) {
        log.debug('run !');

        if (motor !== 'left' && motor !== 'right') {
            return Promise.reject(new TypeError('motor must be either left or right'));
        }
        if (Math.abs(pwm) > 255) {
            return Promise.reject(new RangeError('abs(pwm) must be < 255'));
        }

        let packetNumber = (motor === 'right') ? 1 : 0;
        let runPacket = new MotorRunPacket(packetNumber, pwm);

        return this.communication.send(runPacket);
    }


    turn(angle) {
        log.debug('turn !');

        let turnPacket = new TurnPacket(angle);

        return this.communication.send(turnPacket);
    }


    setTunings(kp, ki, kd, dt) {
        log.debug('Tunings !');

        let tuningsPacket = new TuningsPacket(kp, ki, kd, dt);

        return this.communication.send(tuningsPacket);
    }


    setOdometry(point, orientation) {
        log.debug('Set odometry !');

        let setOdometryPacket = new SetOdometryPacket(point, orientation);

        return this.communication.send(setOdometryPacket);
    }
}

export default MotorController;