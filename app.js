const express = require('express');
const fs = require('fs');

/**
 *! express() function will add a bunch of function to variable app 
*/
const app = express();


const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


/**
 *! ==> /api/v1/tour' : end point
 *! (req, res) => {} : route handler, this callback function will run inside the event loop 
*/
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
})


const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
})