import Module from './Module';
import Communication from '../communication/Communication';
import ClampGetPosPacket from '../communication/packets/ClampGetPosPacket';
import ClampGoToPacket from '../communication/packets/ClampGoToPacket';
import ClampStopPacket from '../communication/packets/ClampStopPacket';
import ClampInitPacket from '../communication/packets/ClampInitPacket';
import logger from '../libs/logger';


let log = logger.getLogger(module)

/**
 * Interface with eurobot-clampController module
 * over I²C
 */
class ClampController extends Module {

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