const utils = require('req-res-utils');
const R = require('ramda');

const movies = require('../data/movie_details3.json');
const genres = require('../data/genres.json');

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

module.exports = {
  createMoviesResponse: createMoviesResponse,
  genres: genres,
  movies: movies,
  genreFilter: genreFilter
};
