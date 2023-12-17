/** @format */

import { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../context-data/Store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Home = () => {
	const {
		token,
		successNotification,
		failedNotification,
		searchQuery,
		fillSearchQuery,
		folders,
		setFolders,
		notes,
		setNotes,
	} = useAppContext();
	const naviagte = useNavigate();
	const [showFolderOptions, setShowFolderOptions] = useState([]);
	const [showFolderForm, setShowFolderForm] = useState(false);
	const [folderCount, setFolderCount] = useState(0);
	const [notesCount, setNotesCount] = useState(0);
	const [backupHomeData, setBackupHomeData] = useState([]);
	const [deleteFolder, setDeleteFolder] = useState(false);
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};
	const toggleFolderCreationForm = () => {
		setShowFolderForm((showFolderForm) => !showFolderForm);
	};

	const [folderForm, setFolderForm] = useState({
		name: "",
		bgColor: "",
	});

	const handleNewFormData = (e) => {
		const { name, value } = e.target;
		console.log("type of value : ", typeof value);
		console.log("value: ", value);
		setFolderForm((folderForm) => ({
			...folderForm,
			[name]: value,
		}));
	};

	const handleFolderFormSubmit = async (e) => {
		e.preventDefault();
		console.log("folderform: ", folderForm);
		try {
			const res = await axios.post(
				"http://localhost:5000/api/folder/create",
				folderForm,
				{ headers }
			);
			console.log(res.data);
			console.log(res);
			if (res.status === 201) {
				console.log("Folder created successfully");
				setFolderCount((folderCount) => folderCount + 1);
				successNotification(res.data.msg);
				setFolderForm({ name: "", bgColor: "" });
				toggleFolderCreationForm();
			} else {
				console.log("Folder  creation failed");
				failedNotification(res.data.msg);
			}
		} catch (error) {
			console.log("error in creating form: ", error);
			failedNotification(error.response.data.msg);
		}
	};

	const folderCreationFormUI = () => {
		return (
			<div className="folder-form-container">
				<form className="folder-form" onSubmit={handleFolderFormSubmit}>
					<input
						type="text"
						placeholder="Folder Name"
						autoComplete="off"
						value={folderForm.folderName}
						name="name"
						onChange={handleNewFormData}
					/>
					<input
						type="color"
						placeholder="Choose Folder Color"
						autoComplete="off"
						value={folderForm.folderColor}
						name="bgColor"
						onChange={handleNewFormData}
					/>

					<div className="folder-form-btn">
						<p className="p-toggle-form" onClick={toggleFolderCreationForm}>
							Cancel
						</p>
						<button type="submit">Create Folder</button>
					</div>
				</form>
			</div>
		);
	};

	const toggleFolderOptions = (index) => {
		setShowFolderOptions((prevOptions) => {
			console.log("prevOptions: ", prevOptions);
			for (let i = 0; i < prevOptions.length; i++) {
				if (prevOptions[i] === true && i !== index) {
					prevOptions[i] = false;
				}
			}
			const updatedOptions = [...prevOptions];
			updatedOptions[index] = !updatedOptions[index]; // Toggle the options for the clicked folder
			return updatedOptions;
		});
	};

	const handleDeleteFolder = async (id, index) => {
		try {
			const res = await axios.delete(
				`http://localhost:5000/api/folder/delete/${id}`,
				{ headers }
			);
			if (res.status === 200) {
				console.log("Folder deleted successfully ");
				setShowFolderOptions((prevOptions) => {
					const updatedOptions = [...prevOptions];
					updatedOptions[index] = false;
					return updatedOptions;
				});
				setDeleteFolder((prev) => !prev);
				setFolderCount((folderCount) => folderCount - 1);
				setNotesCount((prev) => prev - 1);

				successNotification(res.data.msg);
			}
		} catch (error) {
			console.log("Folder Deletation Failed: ", error);
			failedNotification(error.response.data.msg);
		}
	};

	useEffect(() => {
		const fetchNotes = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/notes/all-notes",
					{ headers }
				);
				if (response.data.notes !== undefined) {
					setNotesCount((prev) => prev + 1);
					response.data.notes.reverse().splice(6);
					setNotes(response.data.notes);
					console.log("response ", response);
				}

				if (response.data.notes === undefined) {
					setNotesCount((prev) => prev - 1);
					setNotes([]);
				}

				console.log("home searchQuaery: ", searchQuery);
				if (searchQuery.length > 0) {
					const searchData = await axios.get(
						`http://localhost:5000/api/notes/search?title=${searchQuery}`,
						{ headers }
					);
					if (searchData.data.results.length > 0) {
						setBackupHomeData(notes);
						setNotesCount((prev) => prev + 1);
						setNotes(searchData.data.results.reverse());
					} else {
						if (backupHomeData.length != 0) {
							setNotes(backupHomeData);
						}
					}
				}

				const folderResponse = await axios.get(
					"http://localhost:5000/api/folder/get-folders",
					{ headers }
				);

				if (folderResponse.data.folders !== undefined) {
					folderResponse.data.folders.reverse().splice(6);
					setFolders(folderResponse.data.folders);
					setFolderCount(folderResponse.length);
				}
				if (folderResponse.data.folders === undefined) {
					setFolders([]);
					setFolderCount(0);
				}
				console.log("folderc", folderResponse.data.folders);
			} catch (error) {
				console.log("Error in fetching notes", error);
			}
		};

		fetchNotes(); // Call the async function inside useEffect
	}, [token, folderCount, searchQuery]);

	const optionsUI = (key, folder) => {
		console.log(folder._id);
		return (
			<div className="side-options">
				<p>Rename Folder</p>
				<p onClick={() => handleDeleteFolder(folder._id, key)}>Delete Folder</p>
			</div>
		);
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

	const handleNewFolderPage = (id) => {
		naviagte(`/note/${id}`);
	};
	const returnFolderUI = (folder, key) => {
		const rawBackendDate = folder.createdAt;
		const backendDate = new Date(rawBackendDate);
		const day = backendDate.getDate().toString().padStart(2, "0");
		const month = (backendDate.getMonth() + 1).toString().padStart(2, "0");
		const year = backendDate.getFullYear();
		const formattedDate = `${day}/${month}/${year}`;
		return (
			<div title={folder.name} className="folder">
				<div className="upper-folder-div">
					<i
						className="fa-solid fa-folder fa-new-folder"
						onClick={() => handleNewFolderPage(folder._id)}
						style={{ color: folder.bgColor }}></i>
					<i
						className="fa-solid fa-ellipsis dots"
						title="More actions"
						onClick={() => toggleFolderOptions(key)}></i>
					{showFolderOptions[key] && optionsUI(key, folder)}
				</div>
				<div className="lower-folder-div">
					<p className="title">{folder.name} </p>
					<p className="date">{formattedDate}</p>
				</div>
			</div>
		);
	};

	return (
		<div className={showFolderForm ? "home-page-for-folder-form" : "home-page"}>
			<div className={showFolderForm ? "blur-background" : "folders-div"}>
				<p className="recent-folder">Recent Folders</p>
				<div className="folders-and-create-folder">
					<div className="folders-collection">
						{folders.map((folder, key) => returnFolderUI(folder, key))}
					</div>
					<div className="create-new-folder" onClick={toggleFolderCreationForm}>
						<i className="fa-solid fa-folder"></i>
						<p>New Folder</p>
					</div>
				</div>
			</div>
			<div className={showFolderForm ? "blur-background" : "notes-div"}>
				<p className="recent-notes">My Notes</p>
				<div className="notes-and-create-new-note">
					<div className="notes-collection" style={{ padding: 9 }}>
						{notes.map((note, key) => returnNotesUI(note, key))}
					</div>
					<Link to="/create-note">
						<div className="create-new-note">
							<i className="fa-solid fa-note-sticky"></i>
							<p>New Note</p>
						</div>
					</Link>
				</div>
			</div>
			{showFolderForm && folderCreationFormUI()}
		</div>
	);
};

export default Home;
