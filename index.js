const fs = require('fs');
const http = require('http');
const url = require('url')

/**
 *! we will use the synchronous readFile version 
 *! synchronous version will block the code execution but in this case it's not a problem
 *! this code just executed once in the beginning 
 *! only the callback function of createServer() will executed each time have a new request 
 *! this block code outside the callback function of createServer() so it will executed once we start the program  
*/
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

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
    }else if(pathName === '/api') {

        /**
         *! this is not perfect because, each time user hit /api route 
         *! the file will have to be read and then send back 
         *! instead we just need read the file once in the beginning 
         *! and then each time someone hit the route simply send back the data without having to read it each time user request it 
        */
        // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (error, data) => {
        //     res.writeHead(200, {
        //         'Content-type': 'application/json',
        //     })
        //     res.end(data)
        // })

        // response data of readFileSync
        res.end(data)

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

