const fs = require('fs');
const http = require('http');

/**
 *! createServer() accept a callback function 
 *! which will be fire each time a new request hit server   
 *! -----------------
 *! callback function access two important variables, it is req and res 
*/
const server = http.createServer((req, res) => {
    console.log(res);
    res.end('hello from the server');
})


server.listen(8000, '127.0.0.1', () => {
    console.log('the server this listen in port 8000');
})

