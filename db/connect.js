const mongoose = require("mongoose");
require("colors");

const connectDB = async (url) => {
	try {
		await mongoose.connect(url);
		console.log("mongoDB connected".blue);
	} catch (error) {
		console.log(error);
	}
};

module.exports = connectDB;
