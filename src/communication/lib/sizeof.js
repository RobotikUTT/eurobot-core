/**
 * Gets the size of a given variable type
 * @param  {String} type The variable type (int8, uint8, int16, uint16, float or bool)
 * @return {Number} The size (in bits)
 */
export default function sizeof(type) {
    switch(type) {
        case 'int8':
        case 'uint8':
            return 8;
            break;
        case 'int16':
        case 'uint16':
            return 16;
            break;
        case 'bool':
            // As all buffers use bytes and not bits, we'll encode a boolean on one byte
            return 8;
            break;
        case 'float':
            return 32;
            break;
    }
}
