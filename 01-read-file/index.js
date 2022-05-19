const fs = require('fs');
const path = require('path');
const readableStream = fs.createReadStream(`${path.dirname(__filename)}/text.txt`);
readableStream.on('data', (chunk) => console.log(chunk.toString()));
readableStream.on('error', (error) => console.log(error.message));
