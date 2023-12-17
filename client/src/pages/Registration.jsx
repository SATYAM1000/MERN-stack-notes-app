/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../context-data/Store";
import axios from "axios";
const Registration = () => {
	const {
		toggleIsLoggedIn,
		successNotification,
		failedNotification,
		storeTokenInLocalStorage,
		functionToSetToken,
		setUsername,
		setUserEmail,
	} = useAppContext();

	const [user, setUser] = useState({
		username: "",
		email: "",
		password: "",
	});
	const navigate = useNavigate();

	const handleNewUser = (e) => {
		const { name, value } = e.target;
		setUser((prevNote) => ({
			...prevNote,
			[name]: value,
		}));
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:5000/api/user/register",
				user
			);
			console.log(response);
			if (response.status === 201) {
				console.log("User registered successfully");
				successNotification(response.data.msg);
				setUsername(user.username);
				setUserEmail(user.email);
				setUser({ username: "", email: "", password: "" });
				storeTokenInLocalStorage(response.data.token);
				functionToSetToken(response.data.token);
				console.log("token : ", response.data.token);
				toggleIsLoggedIn();

				navigate("/");
			} else {
				console.log("Registration failed");
				failedNotification(response.data.msg);
			}
		} catch (error) {
			console.log("Registration failed: ", error);
			console.log(error.response.data.msg);
			setUser({ username: "", email: "", password: "" });
			failedNotification(error.response.data.msg);
		}
	};

	return (
		<div className="registration">
			<h2>
				Register to <span>iNote</span>
			</h2>
			<form onSubmit={handleFormSubmit}>
				<div className="username-field">
					<input
						value={user.username}
						name="username"
						onChange={handleNewUser}
						type="text"
						placeholder="Username"
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
				<div className="password-field">
					<input
						value={user.password}
						name="password"
						onChange={handleNewUser}
						type="password"
						placeholder="Password"
						autoComplete="off"
						required
					/>
				</div>
				<div className="reg-btn">
					<button className="btn" type="submit">
						Register
					</button>
					<p className="reg-para">
						Already registered? <Link to="/login">Login</Link>
					</p>
				</div>
			</form>
		</div>
	);
};

export default Registration;
