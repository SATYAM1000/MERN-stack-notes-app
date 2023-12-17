/** @format */

import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context-data/Store";
import { useNavigate } from "react-router-dom";
const Login = () => {
	const navigate = useNavigate();
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
		email: "",
		password: "",
	});

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
				"http://localhost:5000/api/user/login",
				user
			);
			if (response.status === 200) {
				console.log("Login successful");
				successNotification(response.data.msg);
				toggleIsLoggedIn();
				storeTokenInLocalStorage(response.data.token);
				functionToSetToken(response.data.token);
				setUsername(response.data.userData.username);
				setUserEmail(user.email);
				console.log("user: ", user.name, "  ", user.email);
				setUser({ email: "", password: "" });
				navigate("/");
			}
		} catch (error) {
			console.log("Login Failed: ", error);
			failedNotification(error.response.data.msg);
		}
	};

	return (
		<div className="login">
			<h2>Welcome Back</h2>
			<form onSubmit={handleFormSubmit}>
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
						Login
					</button>
					<p className="reg-para">
						Not registered? <Link to="/register">Register</Link>
					</p>
				</div>
			</form>
		</div>
	);
};

export default Login;
