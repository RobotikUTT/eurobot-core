import Packet from './Packet';


const PACKET_NUMBER = 2;
const PACKET_LENGTH = 12;


/**
 * Packet used to request the odometry state and store
 * the response packet
 */
class OdometryPacket extends Packet {

    /**
     * Constructor
     */
    constructor() {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.point = {
            x: 0,
            y: 0
        };
        this.orientation = 0;
    }


    serialize() {
        // Request packet only with no arguments
        return new Buffer(0);
    }


    deserialize(data) {
        this.point.x = data.readFloatBE(0);
        this.point.y = data.readFloatBE(4);
        this.orientation = data.readFloatBE(8);
    }


    /**
     * Point getter
     * @return {Object} Carthesian coordinates
     */
    getPoint() {
        return this.point;
    }

    /**
     * orientation getter
     * @return {Int} Robot orientation
     */
    getOrientation() {
        return this.orientation;
    }
}


export default OdometryPacket;