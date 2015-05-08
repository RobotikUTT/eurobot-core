import Packet from './Packet';


const PACKET_NUMBER = 1;
const PACKET_LENGTH = 4;


class MovePacket extends Packet {

    constructor(distance = 0) {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.distance = distance
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        data.writeFloatBE(this.distance, 0);
        return data;
    }


    deserialize(data) {
        // Send packet only with no response
        return null;
    }
}


export default MovePacket;