import Packet from './Packet';


const PACKET_NUMBER = 9;
const PACKET_LENGTH = 12;


/**
 * Packet used to request the odometry state and store
 * the response packet
 */
class OdometryPacket extends Packet {

    /**
     * Constructor
     */
    constructor(point = {x: 0, y: 0}, orientation = 0) {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.point = point;
        this.orientation = orientation;
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        data.writeFloatBE(this.point.x, 0);
        data.writeFloatBE(this.point.y, 4);
        data.writeFloatBE(this.orientation, 8);

        return data;
    }


    deserialize(data) {

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