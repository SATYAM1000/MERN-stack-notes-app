/** @format */

import "./Notes.css";
import { useAppContext } from "../context-data/Store";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const Notes = () => {
	const { token } = useAppContext();
	const [allnotes, setAllnotes] = useState([]);
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};
	useEffect(() => {
		const fetchnotesDetails = async () => {
			try {
				const notesResponse = await axios.get(
					"http://localhost:5000/api/notes/all-notes",
					{ headers }
				);

				if (notesResponse.status === 200) {
					setAllnotes(notesResponse.data.notes.reverse());
				}
			} catch (error) {
				console.log("Error fetching notess: ", error);
			}
		};
		fetchnotesDetails();
	}, []);

	const returnNotesUI = (note, key) => {
		const dateFromBackend = note.date;
		const backendDate = new Date(dateFromBackend);
		const day = backendDate.getDate().toString().padStart(2, "0");
		const month = (backendDate.getMonth() + 1).toString().padStart(2, "0");
		const year = backendDate.getFullYear();
		const formattedDate = `${day}/${month}/${year}`;

		return (
			<div className="notes-ui" style={{ background: note.bgColor }}>
				<div className="date-and-title">
					<p className="note-date">{formattedDate}</p>
					<div className="title-and-icon">
						<p className="note-title">{note.title}</p>
					</div>
				</div>
				<div className="content-and-time">
					<p className="content">{note.content}</p>
				</div>
			</div>
		);
	};
	return (
		<div className="notes-page">
			<h2>All Notes</h2>
			<div className="notes-container">
				{allnotes.map((value, key) => returnNotesUI(value, key))}
				<Link to='/create-note'><div className="create-new-note">
					<i className="fa-solid fa-note-sticky"></i>
					<p>New Note</p>
				</div></Link>
			</div>
		</div>
	);
};

export default Notes;
