const { Schema, Types, model } = require("mongoose");

const MovieSchema = new Schema(
	{
		id: {
			type: String,
			// not used for UI
			// required: [true, "Please provide movie id"],
			// unique: true,
		},
		movieName: {
			type: String,
			required: [true, "Please provide movie name"],
			default: "pending",
		},
		status: {
			type: String,
			enum: ["planning_to_watch", "in_progress", "watched"],
			default: "planning_to_watch",
		},
		userScore: {
			type: String,
			enum: [1, 2, 3, 4, 5],
			default: 1,
		},
		startYear: {
			type: String,
		},
		endYear: {
			type: String,
		},
		releaseDate: {
			type: String,
		},
		primaryImage: {
			type: String,
		},
		createdBy: {
			type: Types.ObjectId,
			ref: "User",
			required: [true, "Please provide user"],
		},
	},
	{ timestamps: true }
);

module.exports = model("Movie", MovieSchema);
