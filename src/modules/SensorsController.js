import Module from './Module';
import logger from '../libs/logger';


let log = logger.getLogger(module)

const UPDATE_POS_PERIOD = 100; //ms

class SensorsController extends Module {

    /**
     * Constructor
     * @param  {Int} address I2C slave address
     * @param  {Int} data available pin
     */
    constructor(address, availablePin) {
        super(address, availablePin);
        this.pos = 0;

        this.communication.on('data', () => {
            this.emit('obstacle');

            this.getDistance()
                .then((pos) => {
                    log.info('Sonar pos: ' + pos);
                    this.pos = pos;
                    this.communication.previousDataState = 'low';
                })
                .catch((err) => {
                    log.error('SensorsController getDistance fail: '+err);
                    this.communication.previousDataState = 'low';
                });
        });
    }

    getDistance() {
        return this.communication.request(0x50)
            .then(function(packet) {
                return Promise.resolve(packet.pos);
            });
    }
}

export default SensorsController;