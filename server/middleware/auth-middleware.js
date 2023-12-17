/** @format */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../schemas/user-schema.js";

dotenv.config();

const authMiddleware = async (req, res, next) => {
	const token = req.header("Authorization");

	if (!token) {
		return res.status(401).json({ message: "Unauthorized User" });
	}

	const jwtToken = token.split(" ")[1];
	try {
		const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
		// console.log("isVerified : ", isVerified);

		if (!isVerified || !isVerified.email) {
			throw new Error("Invalid token format or payload");
		}

		const userData = await User.findOne({ email: isVerified.email }).select({
			password: 0,
		});

		if (!userData) {
			throw new Error("User not found");
		}

		req.user = userData;
		req.token = token;
		req.userID = userData._id;

		next();
	} catch (error) {
		console.error("Authentication Error:", error.message);
		return res.status(401).json({ message: "Unauthorized, Invalid token" });
	}
};

export default authMiddleware;
