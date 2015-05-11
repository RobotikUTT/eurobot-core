import Packet from './Packet';


const PACKET_NUMBER = 0x34;
const PACKET_LENGTH = 2;


class MoveServoPacket extends Packet {

    /**
     * Constructor
     */
    constructor(servo, command) {
        if (servo !== 'left' && servo !== 'right') {
            throw TypeError('Servo must either be left or right');
        }
        super();
        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.servo = servo;
        this.command = command;
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        let servo = (this.servo === 'left') ? 0 : 1;
        data.writeUInt8(servo, 0);

        return data;
    }


    deserialize(data) {
    }
}


export default MoveServoPacket;