/** @format */

import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context-data/Store";
const Logout = () => {
	const {
		logoutUser,
		toggleIsLoggedIn,
		successNotification,
		setUsername,
		setUserEmail,
	} = useAppContext();
	useEffect(() => {
		logoutUser();
		toggleIsLoggedIn();
		setUsername('User');
		setUserEmail('')
		successNotification("Logout Successful");
	}, [logoutUser]);

	return <Navigate to="/login" />;
};

export default Logout;
