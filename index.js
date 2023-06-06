const fs = require('fs');

/**
 *! Blocking, synchronous way  
*/
const textIn =  fs.readFileSync('./txt/input.txt', 'utf-8');

console.log(textIn);

const textOut = `this is what we know about avocado: ${textIn}`

fs.writeFileSync('./txt/output.txt', textOut);

console.log('File written');



console.log('-------------------- Non-blocking --------------------------');
/**
 *! Non-blocking, asynchronous way  
*/

// readFile do not have to specify the file encoding 
// node will start reading this file start.txt in the background as soon as it ready, 
// it will then start call the callback function 
fs.readFile('./txt/start.txt', 'utf-8',(error, data1) => {
    if(error) return console.log('Error');
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (error, data2) => {
        console.log(data2);

        fs.writeFile('./txt/final.txt', `${data2}\n${data1}`, (error) => {
            console.log('Your file has been written');
        })
    })
})
console.log('this line will run before the actual data is ready');