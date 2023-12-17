/** @format */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Folder from "./pages/Folder";
import Notes from "./pages/Notes";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import MyNote from "./pages/MyNote";
import Contact from "./pages/Contact";
import Logout from "./pages/Logout";
import Read from "./pages/Read";
const App = () => {
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/folders" element={<Folder />} />
				<Route path="/notes" element={<Notes />} />
				<Route path="/create-note" element={<MyNote />} />
				<Route path="/note/:id" element={<Read />} />
				<Route path="/register" element={<Registration />} />
				<Route path="/login" element={<Login />} />
				<Route path="/user" element={<Profile />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="*" element={<Error />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
