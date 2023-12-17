/** @format */

import express from "express";
import Note from "../schemas/notes-schema.js";
import Folder from "../schemas/folder-schema.js";

const createNewNote = async (req, res) => {
	try {
		const { title, content, label, folder, bgColor, folderLocation } = req.body;
		console.log("folderlocation: from frontend: ", folderLocation);
		const userId = req.user._id;

		const newNote = new Note({
			title,
			content,
			label,
			user: userId,
			folder,
			bgColor,
			folderLocation: folderLocation,
		});

		await newNote.save();
		console.log(newNote);

		return res
			.status(201)
			.json({ msg: "Note created successfully", note: newNote });
	} catch (error) {
		console.log("Internal server error: ", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

const getAllNotes = async (req, res) => {
	const userID = req.userID;
	console.log(userID);
	try {
		const allNotes = await Note.find({ user: userID });

		if (allNotes.length < 1) {
			return res.status(202).json({ msg: "No Notes Created" });
		}

		return res
			.status(200)
			.json({ msg: "All notes fetched successfully", notes: allNotes });
	} catch (error) {
		console.error("Error fetching notes:", error);
		return res.status(500).json({ msg: "Server Error" }); // Handle other errors with a 500 status code
	}
};

const searchNotes = async (req, res) => {
	try {
		const { title } = req.query;
		const userId = req.user.id; // Assuming you have the user ID available in the request
		console.log("userId: ", userId);

		if (!title) {
			return res.status(400).json({ error: "Please provide a search query" });
		}

		const searchResults = await Note.find({
			title: { $regex: new RegExp(title, "i") },
			user: userId, // Filter by user ID
		});
		console.log(searchResults);

		if (searchResults.length === 0) {
			return res.status(404).json({ message: "No matching notes found" });
		}

		res.status(200).json({ results: searchResults });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

const notesInFolder = async (req, res) => {
	try {
	  const id = req.params.id;
	  console.log("id : ",id);
	  const userId = req.user.id; // Corrected res.userID to userId for consistency
	  console.log("userid ",userId);
	  const folderDetails = await Folder.findOne({ _id: id, user: userId });
	  console.log("folderDetails: ",folderDetails);
  
	  if (!folderDetails) { // Changed condition to check if folderDetails is falsy
		return res.status(404).json({ msg: "Folder does not exist" });
	  }
  
	  const folderName = folderDetails.name;
	  const notes = await Note.find({ folderLocation: folderName, user: userId });
  
	  if (notes.length === 0) {
		return res.status(200).json({ msg: "No notes found" });
	  }
  
	  return res.status(200).json({ msg: "Notes fetched successfully", notesData: notes });
	} catch (error) {
		console.log("error ",error)
	  return res.status(500).json({ error: "Internal server error",error });
	}
  };
  
export { createNewNote, getAllNotes, searchNotes,notesInFolder };
