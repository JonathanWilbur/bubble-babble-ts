export declare class BubbleBabbleError extends Error {
    constructor(message: string);
}
export declare function encode(input: Uint8Array): string;
export declare function decode(input: string): Uint8Array;
