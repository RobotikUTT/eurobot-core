import Packet from './Packet';


const PACKET_NUMBER = 7;
const PACKET_LENGTH = 2;


/**
 * Packet used to turn the robot
 */
class TurnPacket extends Packet {

    constructor(angle) {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.angle = angle;
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        data.writeInt16BE(this.angle, 0);

        return data;
    }


    deserialize(data) {
        // Send packet only with no response
        return null;
    }
}


export default TurnPacket;