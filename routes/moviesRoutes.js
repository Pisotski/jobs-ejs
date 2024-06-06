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

// GET /jobs (display all the job listings belonging to this user)
// POST /jobs (Add a new job listing)
// GET /jobs/new (Put up the form to create a new entry)
// GET /jobs/edit/:id (Get a particular entry and show it in the edit box)
// POST /jobs/update/:id (Update a particular entry)
// POST /jobs/delete/:id (Delete an entry)

router.route("/").get(getAllMovies).post(createMovie);
router.get("/new ", showBlank);
router.get("/edit/:id ", showMovie);
router.post("/update/:id", updateMovie);
router.post("/delete/:id", deleteMovie);

module.exports = router;
