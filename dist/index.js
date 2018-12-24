"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vowels = 'aeiouy';
const consonants = 'bcdfghklmnprstvzx';
function encode(input) {
    let result = '';
    let checksum = 1;
    let i = 0;
    while (i + 1 < input.length) {
        const byte1 = input.readUInt8(i);
        const byte2 = input.readUInt8(i + 1);
        result += odd_partial(byte1, checksum);
        const d = ((byte2 >> 4) & 15);
        const e = (byte2 & 15);
        result += `${consonants.charAt(d)}-${consonants.charAt(e)}`;
        checksum = next_checksum(checksum, byte1, byte2);
        i += 2;
    }
    if (i < input.length) {
        const byte1 = input.readUInt8(i);
        result += odd_partial(byte1, checksum);
    }
    else {
        result += even_partial(checksum);
    }
    return `x${result}x`;
}
exports.encode = encode;
;
function odd_partial(raw_byte, checksum) {
    const a = (((raw_byte >> 6) & 3) + checksum) % 6;
    const b = (raw_byte >> 2) & 15;
    const c = ((raw_byte & 3) + Math.floor(checksum / 6)) % 6;
    return vowels.charAt(a) + consonants.charAt(b) + vowels.charAt(c);
}
function even_partial(checksum) {
    const a = checksum % 6;
    const b = 16;
    const c = Math.floor(checksum / 6);
    return vowels.charAt(a) + consonants.charAt(b) + vowels.charAt(c);
}
;
function decode(input) {
    if (input.substr(0, 1) !== 'x' || input.substr(-1, 1) !== 'x')
        throw new Error('Corrupt string');
    let ascii_tuples = input.substring(1, input.length - 1).match(/.{3,6}/g);
    if (!ascii_tuples)
        throw new Error('Corrupt string');
    let char_codes = [];
    let checksum = 1;
    let i = 0;
    for (i = 0; i < ascii_tuples.length - 1; ++i) {
        const tuple = decode_tuple(ascii_tuples[i]);
        const byte1 = decode_3part_byte(tuple[0], tuple[1], tuple[2], checksum);
        const byte2 = decode_2part_byte(tuple[3], tuple[4]);
        checksum = next_checksum(checksum, byte1, byte2);
        char_codes.push(byte1);
        char_codes.push(byte2);
    }
    const tuple = decode_tuple(ascii_tuples[ascii_tuples.length - 1]);
    if (tuple[1] === 16) {
        if (tuple[0] !== checksum % 6 || tuple[2] !== Math.floor(checksum / 6))
            throw new Error('Corrupt string');
    }
    else {
        const byte1 = decode_3part_byte(tuple[0], tuple[1], tuple[2], checksum);
        char_codes.push(byte1);
    }
    return Buffer.from(char_codes);
}
exports.decode = decode;
;
function decode_tuple(ascii_tuple) {
    return [
        vowels.indexOf(ascii_tuple[0]),
        consonants.indexOf(ascii_tuple[1]),
        vowels.indexOf(ascii_tuple[2]),
        consonants.indexOf(ascii_tuple[3]),
        consonants.indexOf(ascii_tuple[5])
    ];
}
;
let decode_3part_byte = function (a, b, c, checksum) {
    let high = (a - (checksum % 6) + 6) % 6;
    let mid = b;
    let low = (c - (Math.floor(checksum / 6) % 6) + 6) % 6;
    if (high >= 4 || low >= 4)
        throw new Error('Corrupt string');
    return ((high << 6) | (mid << 2) | low);
};
function decode_2part_byte(d, e) {
    return ((d << 4) | e);
}
function next_checksum(checksum, byte1, byte2) {
    return (((checksum * 5) + (byte1 * 7) + byte2) % 36);
}
