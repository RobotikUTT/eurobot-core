import * as util from 'util';

let Scheduler = require('node-robot').Scheduler;
let log       = require('../libs/logger').getLogger(module);
let Button    = require('../io/Button');
let GpioPin   = require('../libs/GpioPin');


class IA {

    /**
     * Constructor
     *
     * @param modules modules
     */
    constructor(modules) {
        this.motorController = modules.motorController;
        this.sensorsController = modules.sensorsController;
        this.scheduler = new Scheduler();
        this.startButton = new Button(23, 'high');
        this.sideSelector = new GpioPin(12);

        /**
         * Events
         */

        this.startButton.once('start', () => {
            this.start();
        });

        this.mainSequence = this.scheduler.sequence((done) => {
            this.sideSelector.read()
                .then((level) => {
                    if (level === 'high') {
                        // Left
                        this.leftSequence.schedule();
                    }
                    else if (level === 'low') {
                        // Right
                        this.rightSequence.schedule();
                    }

                    this.sensorsController.once('obstacle', () => {
                        log.warn('obstacle !');
                        this.motorController.stop();

                        this.scheduler.interrupt(() => {
                            this.scheduler.sequence(() => {
                               log.debug('Reaction sequence !');
                            }).schedule();
                        });
                    });

                    done();
                })
                .catch((err) => {
                    log.error(err.stack);
                    done();
                });
        });

        this.leftSequence = this.scheduler.sequence((done) => {
            log.info('Left sequence !');

            this.motorController.goTo(1)
                .then(() => {
                    log.info('Arrived in 1');
                    done();
                })
                .catch((err) => {
                    log.error(err.stack);
                    done();
                });
            });

        this.rightSequence = this.scheduler.sequence((done) => {
            log.info('Right sequence !');

            this.motorController.goTo(1)
                .then(() => {
                    log.info('Arrived in 1');
                    done();
                })
                .catch((err) => {
                    log.error(err.stack);
                    done();
                });
        });
    }


    /**
     * Start IA
     */
    start() {
        // Schedule main sequence
        log.info('Start robot !');
        this.mainSequence.schedule();
        this.scheduler.start();
    }

    /**
     * Stop IA
     */
    stop() {

    }
}


export default IA;