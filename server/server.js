/** @format */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectionToDatabase from "./db/database-connection.js";
import userRouter from "./routes/user-routes.js";
import folderRouter from "./routes/folder-router.js";
import noteRouter from "./routes/note-router.js";
dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

//routers--------
app.use("/api/user", userRouter);
app.use("/api/folder", folderRouter);
app.use('/api/notes',noteRouter);
//database connection
connectionToDatabase()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running at http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Database connection error:", err);
	});
