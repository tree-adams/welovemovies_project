const moviesService = require("./movies.service");
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')


const movieExists = (req, res, next) => {
    moviesService
      .read(req.params.movieId)
      .then((movie) => {
        if (movie) {
          res.locals.movie = movie;
          return next();
        }
        return next({ status: 404, message: `Movie cannot be found.` });
      })
      .catch(next);
};

const list = (req, res, next) => {
  moviesService
    .list()
    .then((data) => res.json({ data }))
    .catch(next);
};

const listIfShowing = (req, res, next) => {
  if (req.query.is_showing) {
    moviesService
      .listIfShowing()
      .then((data) => res.json({ data }))
      .catch(next);
  }
  next();
};

async function read(req, res, next) {
    const movieId = req.params.movieId
res.json({data: await moviesService.read(movieId)})
}

async function readMovieTheaters(req, res, next) {
    const movieId = req.params.movieId
    res.json({data: await moviesService.readMovieTheaters(movieId)})
}

async function readMovieReviews(req, res, next) {
    const movieId = req.params.movieId
    res.json({data: await moviesService.readMovieReviews(movieId)})
}

module.exports = {
  list: asyncErrorBoundary(list),
  listIfShowing: asyncErrorBoundary(listIfShowing),
  read: [asyncErrorBoundary(movieExists), read],
  readMovieTheaters: [asyncErrorBoundary(movieExists), readMovieTheaters],
  readMovieReviews: [asyncErrorBoundary(movieExists), readMovieReviews]
};