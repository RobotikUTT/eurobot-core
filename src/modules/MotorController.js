import Module from './Module';
import Communication from '../communication/Communication';
import MovePacket from '../communication/packets/MovePacket';
import MotorStopPacket from '../communication/packets/MotorStopPacket';
import MotorRunPacket from '../communication/packets/MotorRunPacket';
import TurnPacket from '../communication/packets/TurnPacket';
import TuningsPacket from '../communication/packets/TuningsPacket';
import SetOdometryPacket from '../communication/packets/SetOdometryPacket';
import EncoderPacket from '../communication/packets/EncoderPacket';
import ResetEncoderPacket from '../communication/packets/ResetEncoderPacket';
import SetModePacket from '../communication/packets/SetModePacket';
import logger from '../libs/logger';


let log = logger.getLogger(module)

const GOTO_TIMEOUT = 15 * 1000; //ms
const UPDATE_POS_PERIOD = 100; //ms

/**
 * Interface with eurobot-motorController module
 * over I²C
 */
class MotorController extends Module {


    /**
     * Constructor
     * @param  {Int} address I2C slave address
     * @param  {Int} data available pin
     */
    constructor(address, availablePin) {
        super(address, availablePin);

        this.point = {
            x: 0,
            y: 0
        };
        this.orientation = 0;

        /*
            Update motorController position
         */

        setInterval(() => {
            this.updatePosition()
                .then(() => {
                    this.emit('newPosition');
                })
                .catch(function(err) {
                    log.warn('MotorController: ' + err.message);
                });
        }, UPDATE_POS_PERIOD);
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


    /**
     * Update MotorController position
     * @return {Promise} Resolved when position is updated
     */
    updatePosition() {
        return this.communication.request(2)
            .then((packet) => {
                this.point = packet.point;
                this.orientation = packet.orientation;
            });
    }


    /**
     * Stop all motors
     * @return {Promise} Resolved when packet is sent
     */
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


    /**
     * Make the motors turn a given angle
     * @param  {Int} angle in degrees
     * @return {Promise}       Resolved when packet is sent
     */
    turn(angle) {
        log.debug('turn !');

        let turnPacket = new TurnPacket(angle);

        return this.communication.send(turnPacket);
    }


    /**
     * Set enslavement tunings
     * @param {Float} kp Proportional gain
     * @param {Float} ki Integral gain
     * @param {Float} kd Derivative gain
     * @param {UInt} dt  enslavement period
     */
    setTunings(kp, ki, kd, dt) {
        log.debug('Tunings !');

        let tuningsPacket = new TuningsPacket(kp, ki, kd, dt);

        return this.communication.send(tuningsPacket);
    }


    /**
     * Set motorController actual position
     * @param {Object} point       (x,y) in meters
     * @param {Int} orientation orientation in degrees
     */
    setOdometry(point, orientation) {
        log.debug('Set odometry !');

        //TODO: convert in rad
        let setOdometryPacket = new SetOdometryPacket(point, orientation);

        return this.communication.send(setOdometryPacket);
    }


    /**
     * Get leftTicks and rightTicks essentially for wire debugging purposes
     * @return {Promise} Resolved when ticks are received
     */
    getEncoderTicks() {
        log.debug('getEncoder !');

        let encoderPacket = new EncoderPacket();

        return this.communication.request(5)
            .then(function(packet) {
                return Promise.resolve({ left: packet.leftTicks, right: packet.rightTicks });
            })
    }


    /**
     * Reset encoders ticks
     */
    resetEncoderTicks() {
        let resetEncoderPacket = new ResetEncoderPacket();

        return this.communication.send(resetEncoderPacket);
    }


    /**
     * Position getter
     * @return {Object} Position
     */
    getPosition() {
        return {
            point: this.point,
            orientation: this.orientation
        };
    }


    setMode(mode) {
        if (mode === 'distance') {
            mode = 1;
        }
        else if (mode === 'orientation') {
            mode = 0;
        }
        else {
            mode = 2;
        }

        let setModePacket = new SetModePacket(mode);

        return this.communication.send(setModePacket);
    }
}

export default MotorController;