import Packet from './Packet';


const PACKET_NUMBER = 4;
const PACKET_LENGTH = 3;


/**
 * Start a motor
 */
class MotorRunPacket extends Packet {

    constructor(motor, pwm) {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.motor = motor;
        this.pwm = pwm;
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        data.writeUInt8(this.motor, 0);
        data.writeInt16BE(this.pwm, 1);

        return data;
    }


    deserialize(data) {
        // Send packet only with no response
        return null;
    }
}


export default MotorRunPacket;