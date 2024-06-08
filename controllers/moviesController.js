const parseVErr = require("../utils/parseValidationErrs");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
// {
//     _id: new ObjectId('6633eab6f1ae6a07fe2f2e7c'),
//     movieName: 'X-Men',
//     status: 'planning_to_watch',
//     userScore: '1',
//     releaseDate: '{"day":28,"month":9,"year":2000}',
//     primaryImage: 'https://m.media-amazon.com/images/M/MV5BZmIyMDk5NGYtYjQ5NS00ZWQxLTg2YzQtZDk1ZmM4ZDBlN2E3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
//   },
const getAllMovies = async (req, res, next) => {
	const { _id } = req.user;
	let result = await Movie.find({ createdBy: _id });
	res.render("movies", { movies: result });
};

const createMovie = async (req, res, next) => {
	// POST /jobs (Add a new job listing)
	const { _id } = req.user;
	if (!req.body) {
		req.flash("error", "please provide movie details");
		return res.render("addMovie", {
			errors: flash("errors"),
		});
	}

	try {
		await Movie.create({
			createdBy: _id,
			...req.body,
		});
		req.flash("info", `Movie ${req.body.movieName} created`);
	} catch (e) {
		if (e.constructor.name === "ValidationError") {
			parseVErr(e, req);
		} else if (e.name === "MongoServerError") {
			console.log(e);
			req.flash("error", "please provide valid entries.");
		} else {
			return next(e);
		}
		return res.render("addMovie", {
			errors: req.flash("error"),
		});
	} finally {
		// TODO: finally is unnecessary what is a use case for it readability?
		res.redirect("/movies");
	}
};

const showBlank = (req, res, next) => {
	res.render("addEditMovie", { movie: null });
	// GET /movies/new (Put up the form to create a new entry)
};

const showMovie = (req, res) => {
	res.render("addEditMovie", {
		movie: { ...req.body, _id: req.params.movieId },
	});
};

const updateMovie = async (req, res) => {
	const userId = req.user._id;
	const { movieId } = req.params;

	// TODO: talk about error handling
	try {
		const queryObject = { createdBy: userId, _id: movieId };
		await Movie.findOneAndUpdate(queryObject, req.body, {
			// * `new: true` ensures that the method returns the modified document rather than the original document before the update.
			// * `runValidators: true` tells MongoDB to validate the update operation against the schema's validators.
			new: true,
			runValidators: true,
		});
	} catch (e) {
		if (e.constructor.name === "ValidationError") {
			parseVErr(e, req);
		} else if (e.name === "MongoServerError") {
			console.log(e);
			req.flash("error", "please provide valid entries.");
		} else {
			return next(e);
		}
		return res.render("addMovie", {
			errors: req.flash("error"),
		});
	} finally {
		req.flash("info", `Movie ${req.body.movieName} updated`);
		res.redirect("/movies");
	}
};
const deleteMovie = async (req, res) => {
	// POST /jobs/delete/:id (Delete an entry)
	const userId = req.user._id;
	const { movieId } = req.params;

	if (mongoose.isValidObjectId({ _id: movieId }))
		return res.render("movies", {
			errors: req.flash(
				"error",
				"database error, no entry found, please provide valid movie id"
			),
		});

	try {
		const movie = await Movie.findOneAndDelete({
			createdBy: userId,
			_id: movieId,
		});
		req.flash("info", `Movie ${movie.movieName} deleted`);
	} catch (e) {
		// TODO: is it even possible on Delete stage?
		if (e.constructor.name === "ValidationError") {
			parseVErr(e, req);
		} else if (e.name === "MongoServerError") {
			console.log(e);
			req.flash("error", "please provide valid entries.");
		} else {
			return next(e);
		}
		return res.render("movies", {
			errors: req.flash("error"),
		});
	} finally {
		res.redirect("/movies");
	}
};

module.exports = {
	getAllMovies,
	createMovie,
	showBlank,
	showMovie,
	updateMovie,
	deleteMovie,
};
