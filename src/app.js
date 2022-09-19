if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors")
const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");
const theatersRouter = require("./theaters/theaters.router");
// const corsOption = {
//     origin: ['https://localhost:3000']
// }
app.use(express.json());
// app.use(cors(corsOption));
app.use(cors());

app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/theaters", theatersRouter);


// Not found handler
app.use((req, res, next) => {
    next({ 
        status: 404,
        message: `Not found: ${req.originalUrl}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    // console.error(err)
    const { status = 500, message = `Something went wrong!` } = err;
    res.status(status).json({ error: message });
});

module.exports = app;