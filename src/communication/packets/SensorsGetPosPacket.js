import Packet from './Packet';


const PACKET_NUMBER = 0x50;
const PACKET_LENGTH = 12;


/**
 * Packet used to request the odometry state and store
 * the response packet
 */
class SensorsGetPosPacket extends Packet {

    /**
     * Constructor
     */
    constructor() {
        super();
        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.frontPos = 0;
        this.leftPos = 0;
        this.rightPos = 0;
    }


    serialize() {
        // Request packet only with no arguments
        return new Buffer(this.packetLength).fill(0);
    }


    deserialize(data) {
        this.frontPos = data.readFloatBE(0);
        this.leftPos = data.readFloatBE(4);
        this.rightPos = data.readFloatBE(8);
    }
}


export default SensorsGetPosPacket;