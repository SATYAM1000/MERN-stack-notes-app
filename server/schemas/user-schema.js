/** @format */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minLength:8,
		},
		isAdmin:{
			type:Boolean,
			default:false,
		},
		
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	try {
		if (!this.isModified("password")) {
			return next();
		}

		const hashedPassword = await bcrypt.hash(this.password, 10);
		this.password = hashedPassword;
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.generateToken = async function () {
	try {
		return jwt.sign(
			{
				userId: this._id.toString(),
				email: this.email,
				isAdmin: this.isAdmin,
			},
			process.env.JWT_SECRET_KEY,
			{ expiresIn: "30d" }
		);
	} catch (error) {
		console.error(error);
	}
};

const User = mongoose.model("User", userSchema);

export default User;
