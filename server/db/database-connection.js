/** @format */

import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URI=process.env.MONGO_URI;
const connectionToDatabase = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Database connection successful");
	} catch (error) {
		console.log("Database connection failed: ",error);
	}
};

export default connectionToDatabase;
