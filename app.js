const express = require('express');
const fs = require('fs');

/**
 *! express() function will add a bunch of function to variable app
 */
const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/**
 *! ==> /api/v1/tour' : end point
 *! (req, res) => {} : route handler, this callback function will run inside the event loop
 */
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);

  const newID = tours[tours.length - 1].id + 1;
  const newTour = [...tours, { newID, ...req.body }];
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(newTour),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          newTour,
        },
      });
    }
  );
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  const tour = tours.find((item) => item.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
});

/**
 *! PUT: expect receive the entire new updated object
 *! PATCH: only expect the property that actually be updated on the object
 *! 404 the requested resource was not found on the server
 */
app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
        tour: '<Updated tour here....>'
    }
  });
});


/**
 *! 204 mean no content     
*/
app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});



const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
