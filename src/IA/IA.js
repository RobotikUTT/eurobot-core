import * as util from 'util';
import conf from '../helper/config';
import * as logger from '../helper/logger';

let log       = logger.getLogger(module);


class IA {

    constructor() {

    }


    start() {
        log.info('Start');
    }

    stop() {
        log.info('Stop');
    }
}


export default IA;
