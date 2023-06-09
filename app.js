const express = require('express');

/**
 *! express() function will add a bunch of function to variable app 
*/
const app = express();


/**
 *! routing determine how the application response to a certain client request or url
 *! not only response to url also with http method which is use for that request.
*/
app.get('/', (req, res) => {
    res.status(200).json({message: 'hello from the server!'})
})

app.post('/', (req, res) => {
    res.send('You can post to this endpoint')
})

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
})