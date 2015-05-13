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
        // Set modules
        this.motorController = modules.motorController;
        this.sensorsController = modules.sensorsController;

        // IO
        this.startButton = new Button(23, 'high');
        this.sideSelector = new GpioPin(12);

        this.scheduler = new Scheduler();

        /**
         * Events
         */

         // Start robot
        this.startButton.once('start', () => {
            this.start();
        });


        /**
         * Sequences
         */

         // Called on start
        this.mainSequence = this.scheduler.sequence((done) => {

            // Determine the start zone
            this.sideSelector.read()
                .then((level) => {
                    if (level === 'high') {
                        // Yellow side
                        this.yellowSequence.schedule();
                    }
                    else if (level === 'low') {
                        // Green side
                        this.greenSequence.schedule();
                    }

                    // Register sequence on sensor alert
                    this.sensorsController.on('obstacle', () => {
                        log.warn('Obstacle detected');
                        this.motorController.stop();

                        this.scheduler.interrupt(() => {
                            // Schedule reaction sequence
                            this.scheduler.sequence(() => {
                               log.debug('Reaction sequence !');
                            }).schedule();
                        });
                    });

                    done();
                })
                .catch((err) => {
                    log.error('Side selector error: ');
                    log.error(err.stack);
                    done();
                });
        });


        // Called on yellow side
        this.yellowSequence = this.scheduler.sequence((done) => {
            log.info('Yellow sequence started');

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

        // Called on green side
        this.greenSequence = this.scheduler.sequence((done) => {
            log.info('Green sequence started');

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
        log.info('Robot started');
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