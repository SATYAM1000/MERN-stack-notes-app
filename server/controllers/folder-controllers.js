/** @format */

import express from "express";
import Folder from "../schemas/folder-schema.js";
import Note from "../schemas/notes-schema.js";

const createNewFolder = async (req, res) => {
	try {
		const { name, bgColor } = req.body;
		console.log("bgColor: ", bgColor);
		// console.log("req : ", req.body);
		const isFolderAlreadyPresent = await Folder.findOne({
			name: name,
			user: req.user.id,
		});

		if (isFolderAlreadyPresent) {
			return res.status(400).json({ msg: "Folder name already exists" });
		}

		const newFolder = new Folder({
			name: name,
			bgColor: bgColor,
			user: req.user._id,
		});
		await newFolder.save();

		return res
			.status(201)
			.json({ msg: "Folder created successfully", folder: newFolder });
	} catch (error) {
		console.log("Internal server error: ", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

const deleteFolder = async (req, res) => {
	try {
		const id = req.params.id;
		const isFolderExist = await Folder.findOne({ _id: id });
		console.log("isFolderExist: ", isFolderExist);
		if (!isFolderExist) {
			return res.status(404).json({ msg: "Folder does not exist" });
		}
		const userid = isFolderExist.user;
		const fname = isFolderExist.name;
		await Folder.deleteOne({ _id: id });
		console.log("fname: ",fname);
		const ret=await Note.deleteMany({ user: userid, folderLocation: fname });
		console.log("ret: ",ret);

		res.status(200).json({ msg: "Folder deleted successfully" });
	} catch (error) {
		console.log("Internal server error: ", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

const getAllFolders = async (req, res) => {
	try {
		const userID = req.userID;
		const allFolders = await Folder.find({ user: userID });
		if (allFolders.length < 1) {
			return res.status(202).json({ msg: "No Folders Created" });
		}
		return res
			.status(200)
			.json({ msg: "All folders fetched successfully", folders: allFolders });
	} catch (error) {
		console.log("Internal server error: ", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

export { createNewFolder, deleteFolder, getAllFolders };
