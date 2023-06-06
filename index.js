const fs = require('fs');

const textIn =  fs.readFileSync('./txt/input.txt', 'utf-8');

console.log(textIn);

const textOut = `this is what we know about avocado: ${textIn}`

fs.writeFileSync('./txt/output.txt', textOut);

console.log('File written');

