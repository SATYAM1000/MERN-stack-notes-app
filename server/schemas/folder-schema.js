/** @format */

import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		bgColor:{
			type:String,
			default:"#616161",
		}
	},
	{ timestamps: true }
);

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;
