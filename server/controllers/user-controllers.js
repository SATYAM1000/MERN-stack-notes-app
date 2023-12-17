/** @format */

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../schemas/user-schema.js";

const registerUser = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const isEmailAlreadyExist = await User.findOne({ email: email });
		if (isEmailAlreadyExist) {
			return res.status(400).json({ msg: "Email already exists" });
		}
		const newUser = new User({ username, email, password });
		await newUser.save();
		return res.status(201).json({
			msg: "User registered successfully",
			token: await newUser.generateToken(),
		});
	} catch (error) {
		console.log("Internal Server Error: ", error);
		return res.status(500).json({ msg: "Internal Server Error" });
	}
};

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const isUserRegistered = await User.findOne({ email: email });
		if (!isUserRegistered) {
			return res.status(404).json({ msg: "Email or Password is wrong" });
		}
		const isPasswordMatched = await bcrypt.compare(
			password,
			isUserRegistered.password
		);
		if (!isPasswordMatched) {
			return res.status(404).json({ msg: "Email or Password is wrong" });
		}
		const token = await isUserRegistered.generateToken();

		return res
			.status(200)
			.json({
				msg: "Login successful",
				token: token,
				userData: isUserRegistered,
			});
	} catch (error) {
		console.log("Internal Server Error: ", error);
		return res.status(500).json({ msg: "Internal Server Error" });
	}
};

const getUserData = async (req, res) => {
	try {
		const currentUser = await User.findOne({ _id: req.userID });
		return res.status(200).json({msg:"user found",data:currentUser});
	} catch (error) {
		console.log("Internal Server Error: ", error);
		return res.status(500).json({ msg: "Internal Server Error" });
	}
};

export { registerUser, loginUser , getUserData};
