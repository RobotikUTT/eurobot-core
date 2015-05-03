import Packet from './Packet';


const PACKET_NUMBER = 8;
const PACKET_LENGTH = 26;


class TuningsPacket extends Packet {

    constructor(orientation = { kp: 0, ki: 0, kd: 0 },
        distance = { kp: 0, ki: 0, kd: 0}, dt = 50) {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.dt = dt;
        this.orientation = orientation;
        this.distance = distance;
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        data.writeFloatBE(this.orientation.kp, 0);
        data.writeFloatBE(this.orientation.ki, 4);
        data.writeFloatBE(this.orientation.kd, 8);
        data.writeFloatBE(this.distance.kp, 12);
        data.writeFloatBE(this.distance.ki, 16);
        data.writeFloatBE(this.distance.kd, 20);
        data.writeUInt16BE(this.dt, 24);
        return data;
    }


    deserialize(data) {
        // Send packet only with no response
        return null;
    }
}


export default TuningsPacket;