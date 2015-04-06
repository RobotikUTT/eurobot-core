import Communication from '../communication/Communication';
import * as random from '../helpers/random';


/**
 * Interface with eurobot-motorController module
 * over I²C
 */
class MotorController {

    /**
     * Constructor
     * @param  {Int} address I2C slave address
     */
    constructor(address) {
        this.communication = new Communication(address);
        this.communication.open();
    }


    init() {
        // Avoid overflow when incrementing
        let number1 = random.randRange(0, 254);
        let number2 = random.randRange(-128, 126);
        let number3 = random.randRange(0, 65536);
        let number4 = random.randRange(-32768, 33766);

        return this.ping(number1, number2, number3, number4);
    }


    /**
     * Test communication with the module
     * All four number will be incremented
     * @param {UInt8}  number1 first number
     * @param {Int8}   number2 second number
     * @param {UInt16} number3 third number
     * @param {Int16}  number4 forth number
     * @return {Promise}  reolved with the new nember sent back by the module
     */
    ping(number1, number2, number3, number4) {
        return this.communication.request(0, number1, number2, number3, number4)
            .then(function(packet) {
                if (!(number1 === packet.number1-1 && number2 === packet.number2-1 &&
                    number3 === packet.number3-1 && number4 === packet.number4-1)) {
                    throw new Error('Ping test failed');
                }
            });
    }
}

export default MotorController;