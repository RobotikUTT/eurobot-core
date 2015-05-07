import Module from './Module';
import logger from '../libs/logger';


let log = logger.getLogger(module)


class SensorsController extends Module {

    /**
     * Constructor
     * @param  {Int} address I2C slave address
     * @param  {Int} data available pin
     */
    constructor(address, availablePin) {
        super(address, availablePin);
    }

    getDistance() {
        this.communication.request(0x50)
            .then(function(packet) {
                return Promise.resolve(packet.distance);
            });
    }
}

export default SensorsController;