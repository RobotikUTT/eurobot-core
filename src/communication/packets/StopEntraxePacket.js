import Packet from './Packet';


const PACKET_NUMBER = 0xC;
const PACKET_LENGTH = 4;


class StopEntraxePacket extends Packet {

    constructor() {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;
        this.entraxe = 0;
    }


    serialize() {
        return new Buffer(0);
    }


    deserialize(data) {
        this.entraxe = data.readFloatBE(0);
    }
}


export default StopEntraxePacket;