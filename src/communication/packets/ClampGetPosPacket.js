import Packet from './Packet';


const PACKET_NUMBER = 0x32;
const PACKET_LENGTH = 8;


/**
 * Packet used to request the position of the two step motors
 * the response packet
 */
class ClampGetPosPacket extends Packet {

    /**
     * Constructor
     */
    constructor() {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.clamp = 0;
        this.elev = 0;
    }


    serialize() {
        // Request packet only with no arguments
        return new Buffer(0);
    }


    deserialize(data) {
        this.elev = data.readInt32BE(0);
        this.clamp = data.readInt32BE(4);
    }
}


export default ClampGetPosPacket;