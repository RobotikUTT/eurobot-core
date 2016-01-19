const TRUE_BUFFER  = (new Buffer(1)).fill(1);
const FALSE_BUFFER = (new Buffer(1)).fill(0);

export default class CANSerializer {
    constructor (packet) {
        this.packet = packet;
    }

    dataSize() {
        return this.packet.constructor.size();
    }

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
        }

        return buffer;
    }
}
