const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
})

const read = (review_id) => {
    return knex("reviews as r")
        .join("critics as c", "c.critic_id", "r.critic_id")
        .select("r.*", "c.*")
        .where({ "r.review_id": review_id })
        .first()
        .then(addCritic)
}

const destroy = (review_id) => {
    return knex("reviews")
        .where({ review_id }).del()
}

const update = (updatedReview) => {

    return knex("reviews as r")
        .select("r.*")
        .where({ review_id: updatedReview.review_id })
        .update(updatedReview) // no asterisk (not returning any data) bc sqlite (used in test suite)
        .then(() => read(updatedReview.review_id))
}

module.exports = {
    read,
    delete: destroy,
    update
};