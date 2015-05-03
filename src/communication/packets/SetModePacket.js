import Packet from './Packet';


const PACKET_NUMBER = 10;
const PACKET_LENGTH = 1;


/**
 * Packet used to request the odometry state and store
 * the response packet
 */
class SetModePacket extends Packet {

    /**
     * Constructor
     */
    constructor(mode = 2) {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.mode = mode
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        data.writeUInt8(this.mode, 0);

        return data;
    }


    deserialize(data) {
        return null;
    }
}


export default SetModePacket;