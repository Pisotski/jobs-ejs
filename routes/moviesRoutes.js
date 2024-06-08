const express = require("express");
const router = express.Router();

const {
	getAllMovies,
	createMovie,
	showBlank,
	showMovie,
	updateMovie,
	deleteMovie,
} = require("../controllers/moviesController");

router.route("/").get(getAllMovies).post(createMovie);
router.get("/add", showBlank);
router.post("/edit/:movieId", showMovie);
router.post("/update/:movieId", updateMovie);
router.post("/delete/:movieId", deleteMovie);

module.exports = router;
