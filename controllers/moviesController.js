const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllMovies = () => {};
const createMovie = () => {};
const showBlank = () => {};
const showMovie = () => {};
const updateMovie = () => {};
const deleteMovie = () => {};

// GET /jobs (display all the job listings belonging to this user)
// POST /jobs (Add a new job listing)
// GET /jobs/new (Put up the form to create a new entry)
// GET /jobs/edit/:id (Get a particular entry and show it in the edit box)
// POST /jobs/update/:id (Update a particular entry)
// POST /jobs/delete/:id (Delete an entry)

module.exports = {
	getAllMovies,
	createMovie,
	showBlank,
	showMovie,
	updateMovie,
	deleteMovie,
};
