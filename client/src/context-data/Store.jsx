/** @format */

import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AppContext = createContext();
const AppProvider = ({ children }) => {
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [username, setUsername] = useState("User");
	const [userEmail, setUserEmail] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [notes, setNotes] = useState([]);
	const [folders, setFolders] = useState([]);
	const fillSearchQuery = (value) => {
		setSearchQuery(value);
	};

	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};

	useEffect(() => {
		const getUserDetails = async () => {
			if (token.length === 0) {
				return;
			}
			try {
				const response = await axios.get(
					"http://localhost:5000/api/user/user-data",
					{ headers }
				);
				if (response.status === 200) {
					setUsername(response.data.data.username);
					setUserEmail(response.data.data.email);
				}
			} catch (error) {
				console.log("Error in fethching user details");
			}
		};

		getUserDetails();
	}, []);

	const functionToSetToken = (value) => {
		setToken(value);
	};
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const toggleIsLoggedIn = () => {
		setIsLoggedIn((isLoggedIn) => !isLoggedIn);
	};

	const storeTokenInLocalStorage = (token) => {
		return localStorage.setItem("token", token);
	};

	const logoutUser = () => {
		setToken("");
		return localStorage.removeItem("token");
	};

	const toggleIsAdmin = () => {
		setIsAdmin((isAdmin) => !isAdmin);
	};

	const successNotification = (message) => {
		return toast.success(message);
	};
	const failedNotification = (message) => {
		return toast.error(message);
	};

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			setToken(storedToken);
			setIsLoggedIn(true); // Assuming a token means the user is logged in
		}
	}, []);

	return (
		<AppContext.Provider
			value={{
				isLoggedIn,
				toggleIsLoggedIn,
				isAdmin,
				toggleIsAdmin,
				successNotification,
				failedNotification,
				storeTokenInLocalStorage,
				logoutUser,
				token,
				functionToSetToken,
				username,
				userEmail,
				setUsername,
				setUserEmail,
				searchQuery,
				fillSearchQuery,
				notes,
				setNotes,
				folders,
				setFolders,
			}}>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};

export { AppContext, AppProvider, useAppContext };
