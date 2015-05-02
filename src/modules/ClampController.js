import EventEmitter from 'events';
import logger from '../libs/logger';


let log = logger.getLogger(module)


class ClampController extends EventEmitter {

    /**
     * Constructor
     * @param  {Int} address I2C slave address
     */
    constructor(address) {
        super();

        try {
            this.communication = new Communication(address, 11);
            this.communication.open();
        }
        catch(err) {
            if (err.code === 'ENOENT') {
                log.error('ClampController: I2C bus unavailable');
            }
            else {
                log.error('Cannot connect to ClampController: ' + err);
            }
        }
    }
}

export default ClampController;