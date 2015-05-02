import Packet from './Packet';


const PACKET_NUMBER = 0x31;
const PACKET_LENGTH = 1;


/**
 * Packet used to tell to redo the init to the step motor in the clamp
 * the response packet
 */
class ClampInitPacket extends Packet {

    constructor(motor) {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.motor = motor;
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        data.writeUInt8(this.motor, 0);

        return data;
    }


    deserialize(data) {
        // Send packet only with no response
        return null;
    }
}


export default ClampInitPacket;