const fs = require('fs');
const http = require('http');
const url = require('url')

/**
 *! createServer() accept a callback function 
 *! which will be fire each time a new request hit server   
 *! -----------------
 *! callback function access two important variables, it is req and res 
*/
const server = http.createServer((req, res) => {
    const pathName = req.url;

    console.log(pathName);

    if(pathName === '/' || pathName === 'overview') {
        res.end('this is OVERVIEW page')
    }else if(pathName === '/product') {
        res.end('this is PRODUCT page')
    }else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end('<h1>Page not found</h1>')
    }

})


server.listen(8000, '127.0.0.1', () => {
    console.log('the server this listen in port 8000');
})

