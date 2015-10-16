import Module from './Module';
import * as logger from '../helper/logger';

let log = logger.getLogger(module);

const PING_PERIOD  = 1 * 1000; // ms
const GOTO_TIMEOUT = 15 * 1000; // ms


class MotionController extends Module {

    constructor(robot, pingPeriod = PING_PERIOD) {
        super(robot, pingPeriod);

        this.orientation     = 0;
        this.position        = {
            x: 0,
            y: 0,
        };

        this.resetOdometry();

        // Inject public API to the robot Object
        this.bot.resetOdometry = this.resetOdometry;
        this.bot.goTo          = this.goTo;
        this.bot.run           = this.run;
        this.bot.turn          = this.turn;
        this.bot.setPwm        = this.setPwm;
        this.bot.stop          = this.stop;

        this.bot.position      = this.position;
        this.bot.orientation   = this.orientation;

        /*
            Update odometry
         */
        this.bot.com.on('updateOdometry', (data) => {
            log.debug('updateOdometry: ' + JSON.toString(data));

            this.position    = data.position;
            this.orientation = data.orientation;
        });
    }


    resetOdometry() {
        log.debug('resetOdometry()');
    }


    goTo(x, y, theta) {
        log.debug(```goTo(${x}, ${y}, ${theta})```);

        return this.turn(Math.atan2(y, x))
            .then(() => this.run(Math.sqrt(x * x + y * y)));
    }


    run(distance) {
        log.debug('run(' + distance + ')');

        return new Promise((resolve, reject) => {
            this.bot.com.on('runSuccess', resolve);
            this.bot.com.on('runFail', () => {
                reject(new Error('Unknown error'));
            });
            this.on('disconnect', () => {
                reject(new Error('Module disconnected'));
            });

            setTimeout(() => {
                log.debug('run(' + distance + ') timeout');
                reject(new Error('Timeout'));
            }, GOTO_TIMEOUT);
        });
    }


    turn(angle) {
        log.debug('turn(' + angle + ')');

        return new Promise((resolve, reject) => {
            this.bot.com.on('turnSuccess', resolve);
            this.bot.com.on('turnFail', reject);
            this.on('disconnect', () => {
                reject(new Error('Module disconnected'));
            });

            setTimeout(() => {
                log.debug('run(' + angle + ') timeout');
                reject(new Error('Timeout'));
            }, GOTO_TIMEOUT);
        });
    }


    setPwm(motor, value) {
        log.debug(```setPwm(${motor}, ${value})```);

        return new Promise((resolve, reject) => {
            this.bot.com.on('setPwmSuccess', resolve);
            this.on('disconnect', () => {
                reject(new Error('Module disconnected'));
            });

            setTimeout(() => {
                log.debug('setPwm() timeout');
                reject(new Error('Timeout'));
            }, 1000);
        });
    }


    stop() {
        log.debug('stop()');

        return new Promise((resolve, reject) => {
            this.bot.com.on('motionStopSuccess', resolve);
            this.on('disconnect', () => {
                reject(new Error('Module disconnected'));
            });

            setTimeout(() => {
                log.debug('stop() timeout');
                reject(new Error('Timeout'));
            }, 1000);
        })
        .then(() => {
            this.bot.emit('stop');
        });
    }


    setTunings(tunings) {
        log.debug('setTunings()');

        return new Promise((resolve, reject) => {
            this.bot.com.on('motionTuningsSuccess', resolve);
            this.on('disconnect', () => {
                reject(new Error('Module disconnected'));
            });

            setTimeout(() => {
                log.debug('setTunings() timeout');
                reject(new Error('Timeout'));
            }, 1000);
        });
    }


    getUpdatePosPeriod() {
        return this.updatePosPeriod;
    }

    setUpdatePosPeriod(newPeriod) {
        this.updatePosPeriod = newPeriod;
    }
}

export default MotionController;
