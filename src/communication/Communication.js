import { EventEmitter } from 'events';
import socketcan from 'socketcan';
import promisify  from 'es6-promisify';
import util from 'util';
import * as logger from '../helper/logger';

let log = logger.getLogger(module);


class Communication extends EventEmitter {

    constructor(port) {
        super();
        this.port = port;

        try {
            this.init();
        }
        catch (err) {
            log.error(err);
        }
    }


    init() {
        this.bus = socketcan.createRawChannel(this.port);
        this.bus.addListener('onMessage', (message) => this.parse(message));
        this.bus.start();
    }


    parse(message) {
        log.info(message);
    }


    send(packet) {
        return Promise.resolve();
    }
}


export default Communication;
