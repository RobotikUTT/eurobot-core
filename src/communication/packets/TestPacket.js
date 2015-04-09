import Packet from './Packet';


const PACKET_NUMBER = 0;
const PACKET_LENGTH = 6;


/**
 * Packet used for testing communication between
 * this software and an other module
 */
class TestPacket extends Packet {

    /**
     * Constructor
     * @param {UInt8}  number1 first number
     * @param {Int8}   number2 second number
     * @param {UInt16} number3 third number
     * @param {Int16}  number4 forth number
     */
    constructor(number1 = 42, number2 = -42, number3 = 42, number4 = -42) {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.number1 = number1;
        this.number2 = number2;
        this.number3 = number3;
        this.number4 = number4;
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        data.writeUInt8(this.number1, 0);
        data.writeInt8(this.number2, 1);
        data.writeUInt16BE(this.number3, 2);
        data.writeInt16BE(this.number4, 4);

        return data;
    }


    deserialize(data) {
        this.number1 = data.readUInt8(0);
        this.number2 = data.readInt8(1);
        this.number3 = data.readUInt16BE(2);
        this.number4 = data.readInt16BE(4);
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


export default TestPacket;