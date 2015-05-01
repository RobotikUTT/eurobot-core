import * as util from 'util';

let Scheduler = require('node-robot').Scheduler;
let log       = require('../libs/logger').getLogger(module);


class IA {

    /**
     * Constructor
     *
     * @param modules modules
     */
    constructor(modules) {
        this.motorController = modules.motorController;
        this.scheduler = new Scheduler();

        /**
         * Events
         */

        this.scheduler
            .on('start', () => {
                log.info('Sequence started !');
            })
            .on('sequenceFinished', () => {
                log.info('Sequence finished !');
            });

        // this.sensors.sonar.on('obstacle', () => {
        //     this.scheduler.interrupt(() => {
        //         this.scheduler.sequence(function() {
        //            log.debug('Reaction sequence !');
        //         });
        //     }):
        // });


        this.mainSsequence = this.scheduler.sequence((done) => {
            this.motorController.ping()
                .then(() => {
                    log.info('Connected to motorController');
                    done();
                })
                .catch((err) => {
                    log.error(err.stack);
                });
            })
            .after(0, (done) => {
                this.motorController.getPosition()
                    .then(function(status) {
                        log.info('Actual position x: '+status.x+', y: '+status.y+
                            ', orientation: ' + status.orientation);
                        done();
                    })
                    .catch((err) => {
                        log.error(err.stack);
                    })
            })
            .after(0, (done) => {
                this.motorController.goTo(1, 0)
                    .then(() => {
                        log.info('Arrived in 1,0');
                        done();
                    })
                    .catch((err) => {
                        log.error(err.stack);
                    });
            });
            // .after(1000, (done) => {
            //     this.motorController.goTo(0, 0)
            //         .then(() => {
            //             log.info('Arrived in 0,0');
            //             done();
            //         })
            //         .catch((err) => {
            //             log.error(err.stack);
            //         });
            // });


    }


    /**
     * Start IA
     */
    start() {
        // Schedule main sequence
        this.mainSsequence.schedule();
        this.scheduler.start();
    }

    /**
     * Stop IA
     */
    stop() {

    }
}


export default IA;