const bb = require("../dist/index.js");

// http://wikibin.org/articles/bubble-babble-2.html
console.assert(bb.encode(Buffer.from("")) === "xexax");
console.assert(bb.encode(Buffer.from("1234567890")) === "xesef-disof-gytuf-katof-movif-baxux");
console.assert(bb.encode(Buffer.from("Pineapple")) === "xigak-nyryk-humil-bosek-sonax");

console.assert(bb.decode("xexax").toString() === "");
console.assert(bb.decode("xesef-disof-gytuf-katof-movif-baxux").toString() === "1234567890");
console.assert(bb.decode("xigak-nyryk-humil-bosek-sonax").toString() === "Pineapple");