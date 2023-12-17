/** @format */

import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context-data/Store";
import { Link } from "react-router-dom";
import './Read.css'
import axios from "axios";

const Read = () => {
	const { id } = useParams();
	const [fetchedNotes, setFetchedNotes] = useState([]);
	const { token } = useAppContext();
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};

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
	useEffect(() => {
		const fetchFolderNotes = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/folder/get-folder/${id}`,
					{ headers }
				);
                console.log("response ",response);
				if (response.status === 200 && response.data.msg!=="No notes found") {
					console.log(response.data);
					setFetchedNotes(response.data.notesData);
				} else {
					console.log("Error in fetching data");
				}
			} catch (error) {
				console.log("Error in fetching notes ", error);
			}
		};

        fetchFolderNotes();
	}, [id]);

	return (
        <div className="read-folder">
          <h2>All Notes</h2>
          <div className="notes-holder">
            {fetchedNotes.length !== 0 ? (
              fetchedNotes.map((note, key) => returnNotesUI(note, key))
            ) : (
              <p>Folder is empty <Link to='/create-note'>Create new note</Link></p>
            )}
          </div>
        </div>
      );
      
};

export default Read;
