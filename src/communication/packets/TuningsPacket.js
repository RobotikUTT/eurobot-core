import Packet from './Packet';


const PACKET_NUMBER = 8;
const PACKET_LENGTH = 14;



class TuningsPacket extends Packet {

    constructor(kp, ki, kd, dt) {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.kp = kp;
        this.ki = ki;
        this.kd = kd;
        this.dt = dt;
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        data.writeFloatBE(this.kp, 0);
        data.writeFloatBE(this.ki, 4);
        data.writeFloatBE(this.kd, 8);
        data.writeUInt16BE(this.dt, 12);
        return data;
    }


    deserialize(data) {
        // Send packet only with no response
        return null;
    }
}


export default TuningsPacket;