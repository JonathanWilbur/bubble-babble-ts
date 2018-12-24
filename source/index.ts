const vowels : string = 'aeiouy';
const consonants : string = 'bcdfghklmnprstvzx';

export
function encode (input : Buffer) {
    let result : string = '';
    let checksum : number = 1;
    let i : number = 0;

    // create full tuples
    while (i + 1 < input.length) {
        const byte1 : number = input.readUInt8(i);
        const byte2 : number = input.readUInt8(i + 1);
        result += odd_partial(byte1, checksum);
        const d : number = ((byte2 >> 4) & 15);
        const e : number = (byte2 & 15);
        result += `${consonants.charAt(d)}-${consonants.charAt(e)}`;
        checksum = next_checksum(checksum, byte1, byte2);
        i += 2;
    }

    // handle partial tuple
    if (i < input.length) {
        const byte1 : number = input.readUInt8(i);
        result += odd_partial(byte1, checksum);
    } else {
        result += even_partial(checksum);
    }

    return `x${result}x`;
};

function odd_partial (raw_byte : number, checksum : number) : string {
    const a : number = (((raw_byte >> 6) & 3) + checksum) % 6;
    const b : number = (raw_byte >> 2) & 15;
    const c : number = ((raw_byte & 3) + Math.floor(checksum / 6)) % 6;
    return vowels.charAt(a) + consonants.charAt(b) + vowels.charAt(c);
}

function even_partial (checksum : number) : string {
    const a : number = checksum % 6;
    const b : number = 16;
    const c : number = Math.floor(checksum / 6);
    return vowels.charAt(a) + consonants.charAt(b) + vowels.charAt(c);
};

export
function decode (input : string) : Buffer {
    if (input.substr(0, 1) !== 'x' || input.substr(-1, 1) !== 'x')
        throw new Error('Corrupt string');

    let ascii_tuples : RegExpMatchArray | null = input.substring(1, input.length - 1).match(/.{3,6}/g);
    if (!ascii_tuples) throw new Error('Corrupt string');
    let char_codes = [];
    let checksum = 1;
    let i : number = 0;

    // handle full tuples
    for (i = 0; i < ascii_tuples.length - 1; ++i) {
        const tuple : number[] = decode_tuple(ascii_tuples[i]);
        const byte1 : number = decode_3part_byte(tuple[0], tuple[1], tuple[2], checksum);
        const byte2 : number = decode_2part_byte(tuple[3], tuple[4]);
        checksum = next_checksum(checksum, byte1, byte2);
        char_codes.push(byte1);
        char_codes.push(byte2);
    }

    // handle partial tuple
    const tuple : number[] = decode_tuple(ascii_tuples[ascii_tuples.length - 1]);
    if (tuple[1] === 16) {
        if (tuple[0] !== checksum % 6 || tuple[2] !== Math.floor(checksum / 6))
            throw new Error('Corrupt string');
    } else {
        const byte1 : number = decode_3part_byte(tuple[0], tuple[1], tuple[2], checksum);
        char_codes.push(byte1);
    }
    return Buffer.from(char_codes);
};

function decode_tuple (ascii_tuple : string) : number[] {
    return [
        vowels.indexOf(ascii_tuple[0]),
        consonants.indexOf(ascii_tuple[1]),
        vowels.indexOf(ascii_tuple[2]),
        consonants.indexOf(ascii_tuple[3]),
        consonants.indexOf(ascii_tuple[5])
    ];
};

let decode_3part_byte = function(a : number, b : number, c : number, checksum : number) {
    let high : number = ((a - (checksum % 6) + 6) % 6);
    let mid : number = b;
    let low : number = (c - (Math.floor(checksum / 6) % 6) + 6) % 6;
    if (high >= 4 || low >= 4) throw new Error('Corrupt string');
    return ((high << 6) | (mid << 2) | low);
};

function decode_2part_byte (d : number, e : number) : number {
    return ((d << 4) | e);
}

function next_checksum (checksum : number, byte1 : number, byte2 : number) : number {
    return (((checksum * 5) + (byte1 * 7) + byte2) % 36);
}