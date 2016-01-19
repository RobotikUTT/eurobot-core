const TRUE_BUFFER  = (new Buffer(1)).fill(1);
const FALSE_BUFFER = (new Buffer(1)).fill(0);

export default class UARTSerializer {
    constructor (packet) {
        this.packet = packet;
    }

    dataSizeBuffer() {
        const DATASIZE = this.packet.constructor.size() + 1;
        let buffer;

        if (DATASIZE < 255) {
            buffer = new Buffer(1);
            buffer.fill(0);
            buffer.writeUInt8(DATASIZE, 0);
        } else {
            buffer = new Buffer(2);
            buffer.fill(0);
            buffer.writeUInt8(DATASIZE, 0);
        }

        return buffer;
    }

    commandBuffer() {
        let buffer = new Buffer(1);
        buffer.fill(0);

        return buffer;
    }

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
        }

        return buffer;
    }

    checksum(...buffers) {
        let v = 0;

        let buffer = Buffer.concat(buffers);

        for (let byte of buffer) {
            v = v ^ byte;
        }

        return (new Buffer(1)).fill(v);
    }

    raw() {
        let dataSizeBuffer = this.dataSizeBuffer();
        let commandBuffer  = this.commandBuffer();
        let payloadBuffer  = this.payloadBuffer();
        let checksumBuffer = this.checksum(commandBuffer, payloadBuffer);

        const SIZE = dataSizeBuffer.length + commandBuffer.length + payloadBuffer.length + 1;

        return Buffer.concat([dataSizeBuffer, commandBuffer, payloadBuffer, checksumBuffer], SIZE);
    }
}
