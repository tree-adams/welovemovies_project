const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at"
})

const list = () => {
  return knex("movies").select("*");
};

const listIfShowing = () => {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id");
};

const read = (movie_id) => {
  return knex("movies").select("*").where({ movie_id }).first();
};


function readMovieTheaters(movieId){
    return knex("theaters as t")
     .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
     .join("movies as m", "mt.movie_id", "m.movie_id")
    .select("t.*","mt.is_showing", "m.movie_id")
    .where({ "mt.movie_id": movieId })

}
const readMovieReviews = (movie_id) => {
    return knex("reviews as r")
        .join("critics as c", "c.critic_id", "r.critic_id")
        .select("r.*", "c.*")
        .where({ "r.movie_id": movie_id })
        .then((reviews) => {
        return reviews.map((review) => addCritic(review))
})
}

module.exports = {
  list,
  listIfShowing,
  read,
  readMovieTheaters,
  readMovieReviews
};