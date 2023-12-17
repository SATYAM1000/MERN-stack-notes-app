/** @format */

import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
	{
		date: {
			type: Date,
			default: Date.now,
		},
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		label: {
			type: String,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},

		folder: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Folder",
		},
		bgColor: {
			type: "String",
			default: "#616161",
		},
		folderLocation:{
			type:String,
			default:"null",
		}
	},
	{ timestamps: true }
);


const Note = mongoose.model("Note", noteSchema);

export default Note;
