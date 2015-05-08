import Packet from './Packet';


const PACKET_NUMBER = 0xB;
const PACKET_LENGTH = 0;


class StartEntraxePacket extends Packet {

    constructor() {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;
    }


    serialize() {
        return new Buffer(0);
    }


    deserialize(data) {
    }
}


export default StartEntraxePacket;