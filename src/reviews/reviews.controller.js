const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reviewsService = require("./reviews.service");

const reviewExists = (req, res, next) => {
    reviewsService
      .read(req.params.reviewId)
      .then((review) => {
        if (review) {
          res.locals.review = review;
          return next();
        }
        return next({ status: 404, message: `Review cannot be found.` });
      })
      .catch(next);
}

const VALID_PROPERTIES = [
    "review_id",
    "content",
    "score",
    "created_at",
    "updated_at",
    "critic_id",
    "movie_id",
    "critic"
]

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
  
    const invalidFields = Object.keys(data).filter(
      (field) => !VALID_PROPERTIES.includes(field)
    );
  
    if (invalidFields.length) {
      return next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(", ")}`,
      });
    }
    next();
  }

async function destroy(req, res, next){
    const { review } = res.locals
    await reviewsService.delete(review.review_id)
    res.sendStatus(204)
}

async function update(req, res, next) {
    const reviewId = req.params.reviewId
    const reviewData = req.body.data
    const updatedReview = {
        ...reviewData,
        review_id: reviewId
    }
    res.json({ data: await reviewsService.update(updatedReview) })
}

async function getReviewsWithCritics(req,res,next){
  const {movieId} = req.params
  if(movieId){
    const criticData = await service.getReviewsWithCritics(movieId);
    // console.log(criticData)
    const data = criticData.map((row) =>{
      return {review_id: (row.review_id), content: (row.content), score: (row.score), created_at: (row.created_at),
        updated_at: (row.updated_at), critic_id: (row.critic_id), movie_id: (row.movie_id),
        critic: {critic_id: (row.critic_id), preferred_name: (row.preferred_name),
        surname: (row.surname), organization_name: (row.organization_name), created_at: (row.created_at),
        updated_at: (row.updated_at)
    }}

    })
    res.json({data})
  }
  
}

module.exports = {
    delete: [asyncErrorBoundary(reviewExists), destroy],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(hasOnlyValidProperties), asyncErrorBoundary(update)],
    getReviewsWithCritics
};