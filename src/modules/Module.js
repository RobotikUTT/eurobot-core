import EventEmitter from 'events';
import Communication from '../communication/Communication';
import logger from '../libs/logger';
import random from '../helpers/random';


let log = logger.getLogger(module)

/**
 * Interface with a module
 * over I²C
 */
class Module extends EventEmitter {

    /**
     * Constructor
     * @param  {Int} address I2C slave address
     * @param  {Int} data available pin
     */
    constructor(address, availablePin) {
        super();

        try {
            this.communication = new Communication(address, availablePin);
            this.communication.open();
        }
        catch(err) {
            if (err.message.indexOf('ENOENT') != -1) {
                log.error('Module: I2C bus unavailable');
            }
            else {
                log.error('Cannot connect to a module: ' + err);
            }
        }
    }


    /**
     * Test communication with the module
     * All four number will be incremented
     * @param {UInt8}  number first number
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
}

export default Module;