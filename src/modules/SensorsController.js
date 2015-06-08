import Module from './Module';
import logger from '../libs/logger';
import GpioPin from '../libs/GpioPin';


let log = logger.getLogger(module)

const UPDATE_POS_PERIOD = 100; //ms

class SensorsController extends Module {

    /**
     * Constructor
     * @param  {Int} address I2C slave address
     * @param  {Int} data available pin
     */
    constructor(address, availablePin) {
        //super(address, availablePin);
        this.frontPos = 0;
        this.leftPos = 0;
        this.rightPos = 0;

        this.dataPin = new GpioPin(availablePin);
        this.previousDataState = 'low';

        setInterval(() => {
            this.dataPin.read()
                .then((level)  => {
                    // Emit only RISING event
                    if (level === 'high' &&
                        this.previousDataState === 'low') {
                        this.emit('stop');
                    }
                    if (level === 'low' &&
                        this.previousDataState === 'high') {
                        // this.emit('start');
                    }

                    this.previousDataState = level;
                });
        }, 1);
    }

    getDistance() {
        // return this.communication.request(0x50)
        //     .then(function(packet) {
        //         return Promise.resolve({
        //             front: packet.frontPos,
        //             left: packet.leftPos,
        //             right: packet.rightPos
        //         });
        //     });
    }
}

export default SensorsController;