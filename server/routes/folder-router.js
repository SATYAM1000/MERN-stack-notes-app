/** @format */

import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import {
	createNewFolder,
	deleteFolder,
	getAllFolders,
} from "../controllers/folder-controllers.js";
import { notesInFolder } from "../controllers/note-controllers.js";
const folderRouter = express.Router();
folderRouter.post("/create", authMiddleware, createNewFolder);
folderRouter.get("/get-folders", authMiddleware, getAllFolders);
folderRouter.delete("/delete/:id", authMiddleware, deleteFolder);
folderRouter.get('/get-folder/:id',authMiddleware,notesInFolder)

export default folderRouter;
