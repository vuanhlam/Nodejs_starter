const express = require('express');
const fs = require('fs');

/**
 *! express() function will add a bunch of function to variable app
 */
const app = express();

/**
 *! in order to use Middleware we use app.use(middlewareFunction) 
*/
app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the Middleware');
    /**
     *! if don't call next() the request/response cycle will be stuck in this point 
     *! we would not be able to move on and never can send back the response to the client 
    */
   next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const createTour = (req, res) => {
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
};

const getTour = (req, res) => {
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
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here....>',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//app.get('/api/v1/tours', getAllTours);

//app.post('/api/v1/tours', createTour);

//app.get('/api/v1/tours/:id', getTour);

//app.patch('/api/v1/tours/:id', updateTour);

//app.delete('/api/v1/tours/:id', deleteTour);

/**
 *! chain method
 */
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
