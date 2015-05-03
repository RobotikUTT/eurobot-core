import EventEmitter from 'events';
import Communication from '../communication/Communication';
import logger from '../libs/logger';
import random from '../helpers/random';


let log = logger.getLogger(module)

const PING_PERIOD = 5000; //ms

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

        //Check if the module is connected
        this.lastPing = 0;
        this.aliveState = false;
        this.pingPeriod = PING_PERIOD;
        // this.isAlive();
    }


    /**
     * Test communication with the module if necessary
     * @return {Promise}  reolved with the new nember sent back by the module
     */
    isAlive() {
        let now = (new Date()).getTime(); 
        if(this.communication.lastValidAnswere > this.lastPing)
        {
            this.lastPing = this.communication.lastValidAnswere;
        }

        if(this.lastPing + this.pingPeriod <= now)
        {
            // log.debug('Ping : ' + this.communication.address);
            this.lastPing = (new Date()).getTime();
            return this.communication.request(0, this.communication.address)
                .then(function(packet) {
                    if (this.communication.address !== packet.number) {
                        this.setAlive(false);
                        this.communication.lastValidAnswere = 0;
                        return Promise.reject();
                    }
                    else {
                        this.setAlive(true);
                        return Promise.resolve();
                    }
                })
                .catch(function()
                {
                    this.setAlive(false);
                });
        }
        //if the last ping time is short, take the cache value
        else if(this.aliveState) {
            return Promise.resolve();
        }
        else {
            return Promise.reject();
        }
    }

    /**
     * Confirm that the module is alive and connected or not since now
     * @param {bool} alive - True if it is alive and false if not.
     */
    setAlive(alive = true) {
        this.aliveState = alive;
        this.lastPing = (new Date()).getTime();
    }
}

export default Module;