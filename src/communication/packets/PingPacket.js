import Packet from './Packet';


const PACKET_NUMBER = 0;
const PACKET_LENGTH = 1;


/**
 * Packet used for testing communication between
 * this software and an other module
 */
class PingPacket extends Packet {

    /**
     * Constructor
     * @param {UInt8}  The source number
     */
    constructor(number = 42) {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.number = number;
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        data.writeUInt8(this.number, 0);

        return data;
    }


    deserialize(data) {
        this.number = data.readUInt8(0);
    }


    /**
     * number getter
     */
    getNumber() {
        return this.number;
    }


    /**
     * number setter
     */
    setNumber(number) {
        this.number = number;
    }
}


export default PingPacket;