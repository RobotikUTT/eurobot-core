import Packet from './Packet';


const PACKET_NUMBER = 1;
const PACKET_LENGTH = 5;


/**
 * Packet used to move the robot
 * to a (x, y) point
 */
class MovePacket extends Packet {

    /**
     * Constructor
     * @param {Object} point Carthesian coordinates. x,y {Int16}
     * @param {Int16} forceFace set to true if it should not
     * run backward
     */
    constructor(point, forceFace = false) {
        super();

        this.packetNumber = PACKET_NUMBER;
        this.packetLength = PACKET_LENGTH;

        this.point = {
            x: x,
            y: y
        };
        this.forceFace = forceFace;
    }


    serialize() {
        let data = new Buffer(this.packetLength);

        data.writeInt16BE(this.point.x, 0);
        data.writeInt16BE(this.point.y, 2);

        if (this.forceFace) {
            data.writeUInt8(0xFF, 4);
        }
        else {
            data.writeUInt8(0x00, 4);
        }

        return data;
    }


    deserialize(data) {
        // Send packet only with no response
        return null;
    }


    /**
     * Point getter
     * @return {Object} Carthesian coordinates
     */
    getPoint() {
        return { x: this.point.x, y: this.point.y };
    }



    /**
     * Point setter
     * @param {Object} point Carthesian coordinates
     */
    setPoint(point) {
        this.point.x = point.x;
        this.point.y = point.y;
    }
}


export default MovePacket;