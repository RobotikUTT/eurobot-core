'use strict';

let fs = require('fs');
let path = require('path');

const DIRECTORY = path.join(__dirname, 'protocols');

let protocols = {};

function sizeof(type) {
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
            return 1;
            break;
        case 'float':
            return 4;
            break;
    }
}

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
            baseValue.value = (validate(format[parameter].type, provided[parameter]))
                ? provided[parameter]
                : format[parameter].default || 0
        }

        result[parameter] = baseValue;

        parameterIndex++;
    }

    return result;
}

function maximumLength(format) {
    let l = 0;

    for (let parameter of Object.keys(format)) {
        l += sizeof(format[parameter].type);
    }

    return l;
}

fs
    .readdirSync(DIRECTORY)
    .filter(file => file.slice(-5) === '.json')
    .map(file => require(path.join(DIRECTORY, file)))
    .forEach(protocol => {
        protocols[protocol.name] = class {
            constructor(...args) {
                Object.assign(this, mapData(args, protocol.data));
            }

            static size() {
                return maximumLength(protocol.data);
            }
        };
    });

export default protocols;
