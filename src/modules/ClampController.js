import EventEmitter from 'events';
import Communication from '../communication/Communication';
import ClampGetPosPacket from '../communication/packets/ClampGetPosPacket';
import ClampGoToPacket from '../communication/packets/ClampGoToPacket';
import ClampStopPacket from '../communication/packets/ClampStopPacket';
import ClampInitPacket from '../communication/packets/ClampInitPacket';
import random from '../helpers/random';
import logger from '../libs/logger';


let log = logger.getLogger(module)

const GOTO_TIMEOUT = 15 * 1000; //ms


/**
 * Interface with eurobot-clampController module
 * over I²C
 */
class ClampController extends EventEmitter {

    /**
     * Constructor
     * @param  {Int} address I2C slave address
     */
    constructor(address) {
        super();

        try {
            this.communication = new Communication(address, 11);
            this.communication.open();
        }
        catch(err) {
            if (err.message.indexOf('ENOENT') != -1) {
                log.error('ClampController: I2C bus unavailable');
            }
            else {
                log.error('Cannot connect to ClampController: ' + err);
            }
        }
    }

    /**
     * Give the motor ID corresponding to the string name
     * @param {string} name - The name of the motor
     * @param {int} the corresponding ID
    */
    getMotorId(name)
    {
        switch(name)
        {
            case 'clamp': return 0;
            case 'elev': return 1;
            default: return -1;
        }
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
     * Make the motor go to a given step pos
     * @param {string} motor - String that represent the motor : elev or clamp
     * @param  {Int32} pos - The wanted position of the motor
     * @return {Promise} resolved when the robot finished.
     */
    goTo(motor, pos) {
        log.debug('Step goto !');
        let motorNumber = this.getMotorId(motor);
        let gotoPacket = new ClampGoToPacket(motorNumber, pos);

        if(motorNumber == -1)
        {
            return Promise.reject(new TypeError('motor must be either clamp or elev'));
        }

        return this.communication.send(gotoPacket);
    }


    /**
     * Update MotorController position
     * @return {Promise} Resolved when position is updated
     */
    updatePosition() {
        log.debug('Step update !');
        return this.communication.request((new ClampGetPosPacket).packetNumber)
            .then((packet) => {
                this.emit('clampPos', {'elev': packet.elev, 'clamp': packet.clamp});
            });
    }

    /**
     * Stop a motor and delete every given order
     * @param {string} motor - the motor name
     * @return {Promise} Resolved when packet is sent
     */
    stop(motor) {
        log.debug('Step stop !');
        let motorNumber = this.getMotorId(motor);
        let stopPacket = new ClampStopPacket(motorNumber);

        if(motorNumber == -1)
        {
            return Promise.reject(new TypeError('motor must be either clamp or elev'));
        }

        return this.communication.send(stopPacket);
    }


    /**
     * Init
     * @param {string} motor - the motor name
     * @return {Promise} Resolved when packet is sent
     */
    init(motor) {
        log.debug('Step init !');
        let motorNumber = this.getMotorId(motor);
        let initPacket = new ClampInitPacket(motorNumber);

        if(motorNumber == -1)
        {
            return Promise.reject(new TypeError('motor must be either clamp or elev'));
        }

        return this.communication.send(initPacket);
    }
}

export default ClampController;