import EventEmitter from 'events';
import logger from '../libs/logger';


let log = logger.getLogger(module)


class SensorsController extends EventEmitter {

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
                log.error('SensorsController: I2C bus unavailable');
            }
            else {
                log.error('Cannot connect to SensorsController: ' + err);
            }
        }
    }
}

export default SensorsController;