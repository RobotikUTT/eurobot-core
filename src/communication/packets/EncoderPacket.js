import Packet from './Packet';


const PACKET_NUMBER = 5;
const PACKET_LENGTH = 4;


/**
 * Start a motor
 */
class EncoderPacket extends Packet {

    constructor() {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.leftTicks = 0;
        this.rightTicks = 0;
    }


    serialize() {
        return new Buffer(this.packetLength).fill(0);
    }


    deserialize(data) {
        this.leftTicks = data.readInt16BE(0);
        this.rightTicks = data.readInt16BE(2);
    }
}


export default EncoderPacket;