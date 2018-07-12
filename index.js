const express = require('express');
const bodyParser = require('body-parser');
const R = require('ramda');
const utils = require('req-res-utils');
const moviesHelper = require('./src/movies');

const port = process.env.PORT || 3030
const service_name = process.env.SERVICE_NAME || 'movie-search'
const failPercent = process.env.FAIL_PERCENT || 0.3;

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
    const moviesResponse = moviesHelper.createMoviesResponse(req.query)
    res.send(moviesResponse);
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error.message });
  }
});

app.get('/genres', (req, res) => {
  try {
    res.send(moviesHelper.genres);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// Start the server
app.listen(3030, () => {
  console.log(`${service_name} listening on port ${port}!`);
  console.log(`Failure rate is set to ${failPercent}`);
});
