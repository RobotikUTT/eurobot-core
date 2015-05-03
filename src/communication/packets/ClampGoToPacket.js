import Packet from './Packet';


const PACKET_NUMBER = 0x30;
const PACKET_LENGTH = 5;


/**
 * Packet used to tell a destination to the step motor in the clamp
 * the response packet
 */
class ClampGoToPacket extends Packet {

    constructor(motor, position) {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.motor = motor;
        this.position = position;
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        data.writeUInt8(this.motor, 0);
        data.writeInt32BE(this.position, 1);

        return data;
    }


    deserialize(data) {
        // Send packet only with no response
        return null;
    }
}


export default ClampGoToPacket;