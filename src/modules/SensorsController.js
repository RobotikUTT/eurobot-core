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
        this.frontPos = 0;
        this.leftPos = 0;
        this.rightPos = 0;

        this.communication.on('data', () => {

            this.getDistance()
                .then((pos) => {
                    this.emit('obstacle');
                    this.frontPos = pos.front;
                    this.leftPos = pos.left;
                    this.rightPos = pos.right;

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
                return Promise.resolve({
                    front: packet.frontPos,
                    left: packet.leftPos,
                    right: packet.rightPos
                });
            });
    }
}

export default SensorsController;