import packets from '../communication/packets'

let promisify = require('native-promisify');
let i2c       = require('i2c-bus');


/**
 * Interface with eurobot-motorController module
 * over I²C
 */
class MotorController {

    /**
     * Constructor
     * @param  {String} address motorController I²C address
     */
    constructor(address) {
        this.address = address;
        this.parser  = null;
        this.bus = promisify(i2c.openSync(1), ['i2cWrite']);
        console.log('Connected to motorController');
    }

    close() {
        this.bus.close();
        return this.bus;
    }

    /**
     * Send a packet
     * @param  {Packet} packet Packet to send
     */
    sendPacket(packet) {

    }


    /**
     * Ping the module to test communication
     * Use a TestPacket. If the module responds correctly,
     * the response TestPacket will have a (number+1) number.
     * @param {Int} number Initial number
     */
    ping(number) {
        this.sendPacket(new packets.TestPacket(number));
    }
}

export default MotorController;