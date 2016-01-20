'use strict';

import fs from 'fs';
import path from 'path';
import sizeof from '../lib/sizeof';

let packets = {};

/**
 * Validate a value given its type
 * @param  {String}         type  The type (int8, uint8, int16, uint16, float or bool)
 * @param  {Number|Boolean} value The value to test
 * @return {Boolean} True if value is correct
 */
function validate (type, value) {
    if (typeof value === 'undefined' || value === null) {
        return false;
    }

    switch (type) {
        case 'int8':
            return Number.isInteger(value) && value < 128 && value > -129;
            break;
        case 'uint8':
            return Number.isInteger(value) && value > -1 && value < 255;
            break;
        case 'int16':
            return Number.isInteger(value) && value > -32769 && value < 32,768
            break;
        case 'uint16':
            return Number.isInteger(value) && value > -1 && value < 65536;
            break;
        case 'bool':
            return typeof value === 'boolean' || value === 0 || value === 1;
            break;
        case 'float':
            return n === Number(n) && n % 1 !== 0;
            break;
    }

    return false;
}

/**
 * Given an array of values, will merge with the format and use default values
 * @param  {Array<Number|Boolean>} provided The arguments given to the constructor
 * @param  {Object}                format   The format (from the JSON file)
 * @return {Object} And object of values (with size and type)
 */
function mapData(provided, format) {
    let result = {};

    let parameterIndex = 0;

    for (let parameter of Object.keys(format)) {
        let baseValue = {
            size: sizeof(format[parameter].type),
            type: format[parameter].type
        }

        if (!provided.hasOwnProperty(parameterIndex)) {
            baseValue.value = format[parameter].default || 0;
        } else {
            baseValue.value = (validate(format[parameter].type, provided[parameterIndex]))
                ? provided[parameterIndex]
                : format[parameter].default || 0
        }

        result[parameter] = baseValue;

        parameterIndex++;
    }

    return result;
}

/**
 * Get the size of the packet
 * @param  {Object} format The format (from the JSON file)
 * @return {Number} Sum of sizes used by the format
 */
function maximumLength(format) {
    let l = 0;

    for (let parameter of Object.keys(format)) {
        l += sizeof(format[parameter].type);
    }

    return l;
}

/**
 * Parse from a buffer given a format
 * @param  {Buffer} buffer The given buffer
 * @param  {Object} format The format (from the JSON file)
 * @return {Object} The result object
 */
function parse(buffer, format) {
    let i      = 0;
    let result = {};

    for (let parameter of Object.keys(format)) {
        switch(format[parameter].type) {
            case 'int8':   result[parameter] = buffer.readInt8(i); break;
            case 'uint8':  result[parameter] = buffer.readUInt8(i); break;
            case 'int16':  result[parameter] = buffer.readInt16LE(i); break;
            case 'uint16': result[parameter] = buffer.readUInt16LE(i); break;
            case 'float':  result[parameter] = buffer.readFloatLE(i); break;
            case 'bool':   result[parameter] = buffer[i]; break;
        }

        i += sizeof(format[parameter].type) / 8;

        if (typeof result[parameter] === 'undefined') {
            result[parameter] = format[parameter].default || 0;
        }
    }

    return result;
}

// Read all packets, and create a class with two static methods and the constructor
// that will map and check an array of args with the json format
fs
    .readdirSync(__dirname)
    .filter(file => file.slice(-5) === '.json')
    .map(file => require(path.join(__dirname, file)))
    .forEach(protocol => {
        packets[protocol.name] = class {
            constructor(...args) {
                Object.assign(this, mapData(args, protocol.data));
            }

            static parse(buffer) {
                return parse(buffer, protocol.data);
            }

            static size() {
                return maximumLength(protocol.data);
            }
        };
    });

export default packets;
