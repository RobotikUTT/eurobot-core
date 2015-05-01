import Packet from './Packet';


const PACKET_NUMBER = 6;
const PACKET_LENGTH = 0;


/**
 * Start a motor
 */
class EncoderPacket extends Packet {

    constructor() {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

    }


    serialize() {
        return null;
    }


    deserialize(data) {
    }
}


export default EncoderPacket;