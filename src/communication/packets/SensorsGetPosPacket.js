import Packet from './Packet';


const PACKET_NUMBER = 0x50;
const PACKET_LENGTH = 0;


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
    }


    serialize() {
        // Request packet only with no arguments
        return new Buffer(0);
    }
}


export default SensorsGetPosPacket;