# Bubble-Babble TypeScript Library

* Author: [Jonathan M. Wilbur](https://jonathan.wilbur.space) <[jonathan@wilbur.space](mailto:jonathan@wilbur.space)>
* Copyright Year: 2018
* License: [MIT License](https://mit-license.org/)
* Version: 1.0.1

This is based on [this](https://github.com/tylorr/bubble_babble), but it's in TypeScript.

## Building

To build for NodeJS, run `tsc`. (You must have the TypeScript compiler installed.)

To build for the web, run `npm install` to install the development dependencies, and run
`webpack --config ./build/webpack.config.js`.

All output will be in `./dist`. `bubblebabble.js` is the NodeJS library, and
`bubblebabble.min.js` will be the web library.

## Usage

There are two functions, having these signatures:

```typescript
export declare function encode(input: Uint8Array): string;
export declare function decode(input: string): Uint8Array;
```

They pretty much speak for themselves.

If you are using the web library, these functions will be accessible in the
`bubblebabble` object.

## Contact Me

If you would like to suggest fixes or improvements on this library, please just
[leave an issue on this GitHub page](https://github.com/JonathanWilbur/bubble-babble-ts/issues). If you would like to contact me for other reasons,
please email me at [jonathan@wilbur.space](mailto:jonathan@wilbur.space)
([My GPG Key](https://jonathan.wilbur.space/downloads/jonathan@wilbur.space.gpg.pub))
([My TLS Certificate](https://jonathan.wilbur.space/downloads/jonathan@wilbur.space.chain.pem)). :boar: