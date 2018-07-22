const moviesHelper = require('../src/movies');

test('if genre is known, we get filtered results', () => {
  const args = {
    genre: "Drama",
    limit: 10,
    offset: 0
  }
  const response = moviesHelper.createMoviesResponse(args);

  expect(response.metadata.total).toEqual(68);
  expect(response.data).toEqual([ 81774, 78, 398818, 194662, 449176, 13, 301337, 273481, 550, 168259 ]);
});


test('if genre is not known, we get an exception', () => {
  const args = {
    genre: "unknown"
  }
  
  expect( () =>  moviesHelper.createMoviesResponse(args)).toThrowError(Error);
});
