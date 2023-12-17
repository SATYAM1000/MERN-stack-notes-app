/** @format */

import { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Image from "../assets/profile.jpg";
import { useAppContext } from "../context-data/Store.jsx";
const Navbar = () => {
	const {
		isLoggedIn,
		toggleIsLoggedIn,
		isAdmin,
		username,
		userEmail,
		searchQuery,
		fillSearchQuery,
	} = useAppContext();

	const [togglemenu, setToggleMenu] = useState(false);
	const [searchInput, setSearchInput] = useState("");

	useEffect(() => {
		fillSearchQuery(searchInput);
	}, [searchInput, fillSearchQuery, searchQuery]);

	const handleSearchFunctionality = (e) => {
		setSearchInput(e.target.value);
	};

	const handleToggleMenu = () => {
		setToggleMenu((togglemenu) => !togglemenu);
	};

	return (
		<div className="navbar display-flex">
			<div className="logo-with-hamburger display-flex">
				<i onClick={handleToggleMenu} className="fa-solid fa-bars my-icon"></i>
				<div className={togglemenu ? "menu-list" : "menu-list-display-not"}>
					<div className="upper-menu">
						<div className="all-tasks">
							<Link to="/" className="list-item">
								<i className="fa-solid fa-list-check"></i>
								<p>All Notes</p>
							</Link>
						</div>
						<div className="all-folders">
							<Link to="/folders" className="list-item">
								<i className="fa-solid fa-folder"></i>
								<p>Folders</p>
							</Link>
						</div>
						<div className="all-notes">
							<Link to="notes" className="list-item">
								<i className="fa-solid fa-note-sticky"></i>
								<p>Notes</p>
							</Link>
						</div>
						<div className={isLoggedIn ? "not-display" : "registration-option"}>
							<Link to="/register" className="list-item">
								<i className="fa-solid fa-user"></i>
								<p>Register</p>
							</Link>
						</div>
						<div className={isLoggedIn ? "not-display" : "login-option"}>
							<Link to="/login" className="list-item">
								<i className="fa-solid fa-user"></i>
								<p>Login</p>
							</Link>
						</div>
						<div className={isAdmin ? "logout-option" : "not-display"}>
							<Link to="/dashboard" className="list-item">
								<i className="fa-solid fa-table-columns"></i>
								<p>Dashboard</p>
							</Link>
						</div>
						<div className={isLoggedIn ? "logout-option" : "not-display"}>
							<Link to="/logout" className="list-item">
								<i className="fa-solid fa-right-from-bracket"></i> <p>Logout</p>
							</Link>
						</div>
					</div>
					<div className="middle-menu">
						<Link to="/create-note" className="add-new-note">
							<i className="fa-solid fa-plus"></i>
							<p>Add New Note</p>
						</Link>
					</div>
					<div className="bottom-menu">
						<Link to="/contact" className="contact-opt">
							<i className="fa-solid fa-envelope"></i>
							<p>Need Some Help!!</p>
						</Link>
					</div>
				</div>
				<Link to="/">
					<h2 className="logo">iNote</h2>
				</Link>
			</div>
			<div className="search-bar display-flex">
				<i className="fa-solid fa-magnifying-glass my-icon"></i>
				<input
					type="text"
					value={searchInput}
					onChange={handleSearchFunctionality}
					placeholder="Search"
				/>
			</div>
			<div className="user-profile display-flex">
				<img src={Image} alt={userEmail} title={userEmail} />
				<p className="user-salutation">Hello, {username}</p>
			</div>
		</div>
	);
};

export default Navbar;
