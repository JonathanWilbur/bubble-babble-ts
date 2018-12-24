const bb = require("../dist/bubblebabble.js");

// http://wikibin.org/articles/bubble-babble-2.html
console.assert(bb.encode(Buffer.from("")) === "xexax");
console.assert(bb.encode(Buffer.from("1234567890")) === "xesef-disof-gytuf-katof-movif-baxux");
console.assert(bb.encode(Buffer.from("Pineapple")) === "xigak-nyryk-humil-bosek-sonax");

console.assert((new TextDecoder("utf-8")).decode(bb.decode("xexax")) === "");
console.assert((new TextDecoder("utf-8")).decode(bb.decode("xesef-disof-gytuf-katof-movif-baxux")) === "1234567890");
console.assert((new TextDecoder("utf-8")).decode(bb.decode("xigak-nyryk-humil-bosek-sonax")) === "Pineapple");