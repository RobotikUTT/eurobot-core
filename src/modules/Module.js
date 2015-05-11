import EventEmitter from 'events';
import Communication from '../communication/Communication';
import logger from '../libs/logger';
import random from '../helpers/random';


let log = logger.getLogger(module)

const PING_PERIOD = 1000; //ms

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
            this.lastPing = (new Date()).getTime();
            return new Promise((resolve, reject) => {
                this.communication.request(0)
                .then((packet) => {
                    if (this.communication.address !== packet.number) {
                        this.setAlive(false);
                        this.communication.lastValidAnswere = 0;
                        return reject(new Error('Bad ping answer : ' + packet.number + ' instead of ' + this.communication.address));
                    }
                    else {
                        this.setAlive(true);
                        return resolve();
                    }
                })
                .catch((err) => 
                {
                    this.setAlive(false);
                    return reject(new Error('Cannot send/read ping : ' + err));
                });
            });
        }
        //if the last ping time is short, take the cache value
        else if(this.aliveState) {
            return Promise.resolve();
        }
        else {
            return Promise.reject(new Error('Déjà vu'));
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