/** @format */

import React, { useState } from "react";
import "./Contact.css";
import { Link } from "react-router-dom";
const Contact = () => {
	const [user, setUser] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	});

	const handleNewUser = (e) => {
		const { name, value } = e.target;
		setUser((prevNote) => ({
			...prevNote,
			[name]: value,
		}));
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		console.log("Form submitted with:", user);
	};

	return (
		<div className="contact">
            <h2>Get in Touch</h2>
			<form onSubmit={handleFormSubmit}>
				<div className="name-field">
					<input
						value={user.name}
						name="name"
						onChange={handleNewUser}
						type="text"
						placeholder="Name"
						autoComplete="off"
						required
					/>
				</div>
				<div className="email-field">
					<input
						value={user.email}
						name="email"
						onChange={handleNewUser}
						placeholder="Email"
						type="email"
						autoComplete="off"
						required
					/>
				</div>
				<div className="phone-field">
					<input
						value={user.phone}
						name="phone"
						onChange={handleNewUser}
						type="text"
						placeholder="Phone Number"
						autoComplete="off"
						required
					/>
				</div>
				<div className="message-field">
					<textarea
						value={user.message}
						name="message"
						onChange={handleNewUser}
						type="text"
						placeholder="Message"
						autoComplete="off"
						required></textarea>
				</div>

				<div className="reg-btn">
					<button className="btn" type="submit">
						Send Message
					</button>
				</div>
			</form>
		</div>
	);
};

export default Contact;
