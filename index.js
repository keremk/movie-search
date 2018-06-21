const express = require('express');
const bodyParser = require('body-parser');
const R = require('ramda');
const utils = require('req-res-utils');

const port = process.env.PORT || 3030
const service_name = process.env.SERVICE_NAME || 'movie-search'
const failPercent = process.env.FAIL_PERCENT || 0.3;

// Load sample data
const movies = require('./data/movie_details3.json');
const genres = require('./data/genres.json');

const revenueFilter = revenue => {
  return movie => movie.revenue >= revenue;
};

const genreFilter = genre => {
  return movie => {
    let genreObj = R.find(R.propEq('name', genre))(genres);
    if (typeof genreObj == 'undefined') {
      throw Error(`Genre ${genre} is unknown`);
    }
    return R.contains({ name: genreObj.name, id: genreObj.id })(movie.genres);
  };
};

const createMoviesResponse = (args) => {
  const filters = [
    {
      "name": "revenue", 
      "action": revenueFilter 
    },
    {
      "name": "genre",
      "action": genreFilter
    }
  ];
  const filterMovies = R.curry(utils.filterItems)(args, filters);
  const pageMovies = R.curry(utils.paging.getPagedItems)(args);
  const pickIds = R.map(movie => movie.id)
  return R.pipe(
    filterMovies,
    pickIds,
    pageMovies,
  )(movies);
}

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use(
  bodyParser.json(),
  (req, res, next) => {
    const incomingHeaders = req.headers;
    const headers = Object.assign(
      utils.getCORSHeaders(),
      utils.forwardTraceHeaders(incomingHeaders)
    );
    res.set(headers);
    if (Math.random() < failPercent) {
      // Simulate a failure
      console.log("Failing");
      res.sendStatus(500);
    } else if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  }
);

// Simple restful movies endpoint
app.get('/movies', (req, res) => {
  try {
    const moviesResponse = createMoviesResponse(req.query)
    res.send(moviesResponse);
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
});

app.get('/genres', (req, res) => {
  try {
    res.send(genres);
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
});

// Start the server
app.listen(3030, () => {
  console.log(`${service_name} listening on port ${port}!`);
  console.log(`Failure rate is set to ${failPercent}`);
});
