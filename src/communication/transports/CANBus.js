import EventEmitter from 'events';
import sizeof from '../lib/sizeof';
import protocol from '../protocol';

const TRUE_BUFFER  = (new Buffer(1)).fill(1);
const FALSE_BUFFER = (new Buffer(1)).fill(0);

class CANSerializer {
    constructor (packet) {
        this.packet = packet;
    }

    /**
     * Get the buffer size (in bits)
     * @return {Number} Bits size
     */
    dataSize() {
        return this.packet.constructor.size();
    }

    /**
     * Get the list of values based on JSON format
     * @return {Buffer} The data/payload buffer
     */
    raw() {
        const FORMAT_SIZE = this.packet.constructor.size();

        let buffer = new Buffer(FORMAT_SIZE);
        buffer.fill(0);

        let pos = 0;
        for (let parameter_ of Object.keys(this.packet)) {
            let parameter = this.packet[parameter_];

            switch(parameter.type) {
                case 'uint8' : buffer.writeUInt8(parameter.value, pos); break;
                case 'int8'  : buffer.writeInt8(parameter.value, pos); break;
                case 'uint16': buffer.writeUInt16LE(parameter.value, pos); break;
                case 'int16' : buffer.writeInt16LE(parameter.value, pos); break;
                case 'float' : buffer.writeFloatLE(parameter.value, pos); break;
                case 'bool'  :
                    buffer = (Boolean(parameter.value))
                        ? Buffer.concat([buffer, TRUE_BUFFER], FORMAT_SIZE)
                        : Buffer.concat([buffer, FALSE_BUFFER], FORMAT_SIZE);
                    break;
            }

            pos += sizeof(parameter.type) / 8;
        }

        return buffer;
    }
}

export default class CANBus extends EventEmitter{
    /**
     * Open connection, listen for message
     * @param {String} port The port to use. If none is provided, can not use send nor "message" event
     */
    constructor(port) {
        super();

        if (!port) {
            return;
        }

        let Packets = Object.keys(protocol).map(pName => protocol[pName]);

        this.bus = socketcan.createRawChannel(this.port);
        this.bus.addListener('onMessage', message => {
            if (!Packets.hasOwnProperty(message.id)) {
                return;
            }

            let packet = this.parse(Packets[message.id], message.data);
            this.emit('message', packet);
        });
        this.bus.start();
    }

    /**
     * Send a packet
     * @param {Object} packet A protocol object that will be serialized and sent
     */
    send(packet) {
        if (!this.bus) {
            throw new Error('Port was not configured in constructor.');
        }

        this.bus.send(this.serializer(packet).raw);
    }

    /**
     * Serialize a packet
     * @param  {Object} packet A protocol object that will be serialized
     * @return {Object} An object containing raw/datasize
     */
    serializer(packet) {
        let serialized = new CANSerializer(packet);

        return {
            raw     : serialized.raw(),
            dataSize: serialized.dataSize()
        };
    }

    /**
     * Parse a buffer from the packet
     * @param  {Class}  Packet The packet class (not an instancied object)
     * @param  {Buffer} buffer The source buffer
     * @return {object} The result object
     */
    parse(Packet, buffer) {
        return Packet.parse(buffer);
    }
}
