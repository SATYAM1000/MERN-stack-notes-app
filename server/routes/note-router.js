/** @format */

import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { createNewNote, getAllNotes, searchNotes } from "../controllers/note-controllers.js";

const noteRouter = express.Router();
noteRouter.post("/create", authMiddleware, createNewNote);
noteRouter.get("/all-notes", authMiddleware, getAllNotes);
noteRouter.get('/search',authMiddleware,searchNotes);
export default noteRouter;
