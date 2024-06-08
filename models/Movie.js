const { Schema, Types, model } = require("mongoose");

const MovieSchema = new Schema(
	{
		movieName: {
			type: String,
			required: [true, "Please provide movie name"],
			default: "pending",
		},
		status: {
			type: String,
			required: [
				true,
				"Please one of planning_to_watch, in_progress, or watched",
			],
			enum: ["planning_to_watch", "in_progress", "watched"],
			default: "planning_to_watch",
		},
		userScore: {
			type: String,
			enum: [1, 2, 3, 4, 5],
			required: [true, "Please provide a rating"],
			default: 3,
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
			required: [true, "Please provide a link to movies cover image"],
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
