import EventEmitter from 'events';
import protocol_ from '../protocol';
import sizeof from '../lib/sizeof';

let protocol = Object.keys(protocol_).map(pname => protocol_[pname]);

const TRUE_BUFFER  = (new Buffer(1)).fill(1);
const FALSE_BUFFER = (new Buffer(1)).fill(0);

class UARTSerializer {
    constructor (packet) {
        this.packet = packet;
    }

    /**
     * Get the size (in bits) buffer
     * @return {Buffer} A buffer containing the size (may be one or two bytes length)
     */
    dataSizeBuffer() {
        const DATASIZE = this.packet.constructor.size() + 1;

        if (DATASIZE > 32767) {
            throw new Error('Datasize can not be encoded in 15 bits');
        }

        let buffer;

        if (DATASIZE < 127) {
            // Buffer is 2 byte and write on the second byte
            buffer = new Buffer(1);
            buffer.fill(0);
            buffer.writeUInt8(DATASIZE, 0);
        } else {
            buffer = new Buffer(2);
            buffer.fill(0);
            buffer.writeUInt16(DATASIZE, 0);
        }

        return buffer;
    }

    /**
     * Get the command buffer (one byte)
     * @return {Buffer} The command buffer
     */
    commandBuffer() {
        let buffer = new Buffer(1);
        buffer.fill(0);

        const id = protocol.indexOf(this.packet.constructor);

        if (id < 0) {
            throw new Error('Packet not found');
        }

        if (id > 255) {
            throw new Error('Packet id can not be encoded on one byte');
        }

        buffer.writeUInt8(id);

        return buffer;
    }

    /**
     * Get the list of values based on JSON format
     * @return {Buffer} The data/payload buffer
     */
    payloadBuffer() {
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

    /**
     * Get the checksum buffer
     * @param  {...Buffer} buffers The buffer to sum
     * @return {Buffer} A one byte buffer containing the XOR sum
     */
    checksum(...buffers) {
        let v = 0;

        let buffer = Buffer.concat(buffers);

        for (let byte of buffer) {
            v = v ^ byte;
        }

        return (new Buffer(1)).fill(v);
    }

    /**
     * Get the whole packet buffer (datasize/command/payload/checkum)
     * @return {Buffer} The whole buffer
     */
    raw() {
        let dataSizeBuffer = this.dataSizeBuffer();
        let commandBuffer  = this.commandBuffer(this.packet);
        let payloadBuffer  = this.payloadBuffer();
        let checksumBuffer = this.checksum(commandBuffer, payloadBuffer);

        const SIZE = dataSizeBuffer.length + commandBuffer.length + payloadBuffer.length + 1;

        return Buffer.concat([dataSizeBuffer, commandBuffer, payloadBuffer, checksumBuffer], SIZE);
    }
}

export default class UART extends EventEmitter {
    /**
     * Open connection, listen for message
     * @param {String} port The port to use. If none is provided, can not use send nor "message" event
     * @param {Object} opts The options passed to SerialPort
     */
    constructor(port, opts) {
        super();

        if (!port) {
            return;
        }

        this.port = new SerialPort(port, opts, false);

        this.port.open(err => {
            if (err) { throw err; }

            this.port.on('open', () => {
                this.port.on('message', buffer => {
                    let packet = this.parse(buffer);
                    this.emit('message', packet);
                });
            });
        });
    }

    /**
     * Send a packet
     * @param {Object} packet A protocol object that will be serialized and sent
     */
    send(packet) {
        if (!this.port) {
            throw new Error('Port was not configured in constructor.');
        }

        this.port.write(this.serializer(packet).raw);
    }

    /**
     * Serialize a packet
     * @param  {Object} packet A protocol object that will be serialized
     * @return {Object} An object containing raw/datasize
     */
    serializer(packet) {
        return {
            raw: new UARTSerializer(packet).raw(),
        };
    }

    /**
     * Parse a buffer from the packet
     * @param  {Class}  Packet The packet class (not an instancied object)
     * @param  {Buffer} buffer The source buffer
     * @return {object} The result object
     */
    parse(buffer) {
        let firstByte = ('00000000' + buffer[0].toString(2)).slice(-8);
        let bigLen = firstByte[0] === '1'; // Is the first bit 1 or 0

        let size = bigLen ? buffer.slice(0, 2).readUInt16LE() : buffer.slice(0, 1).readUInt8();
        let id   = bigLen ? buffer.slice(2, 3).readUInt8() : buffer.slice(1, 2).readUInt8();
        let data = bigLen ? buffer.slice(3, -1) : buffer.slice(2, -1);

        if (isNaN(id)) {
            throw new Error('The id does not correspond to any packet');
        }

        // If values does not have the index
        if (!protocol.hasOwnProperty(id)) {
            throw new Error('The id does not correspond to any packet');
        }

        let Packet = protocol[id];

        return Packet.parse(data);
    }
}
