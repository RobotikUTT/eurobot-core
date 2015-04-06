/**
 * Communication packet used to talk with other modules
 * (such as the motor controller module)
 */
class Packet {

    /**
     * Constructor
     */
    constructor() {
        this.packetNumber = -1;
        this.packetLength = -1;
    }


    /**
     * packetNumber getter
     * @return {Int} packet identifier
     */
    getPacketNumber() {
        return this.packetNumber;
    }


    /**
     * packetLength getter
     * @return {Int} length of arguments
     */
    getPacketLength() {
        return this.packetLength;
    }


    /**
     * Serialize the packet in sendBuffer to send it through a bus
     * @return {Buffer} Buffer
     */
    serialize() {
        throw new Error("Virtual method");
    }


    /**
     * Deserialize the packet in recvBuffer to read data
     */
    deserialize() {
        throw new Error("Virtual method");
    }
}


export default Packet;