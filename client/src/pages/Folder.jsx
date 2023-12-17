/** @format */

import "./Folder.css";
import { useAppContext } from "../context-data/Store";
import { useEffect, useState } from "react";
import axios from "axios";
const Folder = () => {
	const { token, successNotification, failedNotification,setFolders } = useAppContext();
	const [allFolders, setAllFolders] = useState([]);
	const [showFolderForm, setShowFolderForm] = useState(false);

	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};
	useEffect(() => {
		const fetchFoldersDetails = async () => {
			try {
				const folderResponse = await axios.get(
					"http://localhost:5000/api/folder/get-folders",
					{ headers }
				);

				if (folderResponse.status === 200) {
					setAllFolders(folderResponse.data.folders.reverse());
					setFolders(folderResponse.data.folders.reverse());
				}
			} catch (error) {
				console.log("Error fetching folders: ", error);
			}
		};
		fetchFoldersDetails();
	}, [allFolders, setAllFolders]);

	const [folderForm, setFolderForm] = useState({
		name: "",
		bgColor: "",
	});

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

	const handleNewFormData = (e) => {
		const { name, value } = e.target;
		setFolderForm((folderForm) => ({
			...folderForm,
			[name]: value,
		}));
	};

	const toggleFolderCreationForm = () => {
		console.log("toggle folder creation form");
		setShowFolderForm((showFolderForm) => !showFolderForm);
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

	const returnFolderUI = (folder, key) => {
		const rawBackendDate = folder.createdAt;
		const backendDate = new Date(rawBackendDate);
		const day = backendDate.getDate().toString().padStart(2, "0");
		const month = (backendDate.getMonth() + 1).toString().padStart(2, "0");
		const year = backendDate.getFullYear();
		const formattedDate = `${day}/${month}/${year}`;
		return (
			<div className="folder">
				<div className="upper-folder-div">
					<i
						className="fa-solid fa-folder fa-new-folder"
						style={{ color: folder.bgColor }}></i>
					<i className="fa-solid fa-ellipsis dots"></i>
				</div>
				<div className="lower-folder-div">
					<p className="title">{folder.name} </p>
					<p className="date">{formattedDate}</p>
				</div>
			</div>
		);
	};
	return (
		<div
			className={
				showFolderForm ? "folder-page-for-folder-form" : "folder-page"
			}>
			<h2>All Folders</h2>
			<div
				className={
					showFolderForm ? "folder-blur-background" : "folders-container"
				}>
				{allFolders.map((value, key) => returnFolderUI(value, key))}
				<div className="create-new-folder" onClick={toggleFolderCreationForm}>
					<i className="fa-solid fa-folder"></i>
					<p>New Folder</p>
				</div>
			</div>
			{showFolderForm && folderCreationFormUI()}
		</div>
	);
};

export default Folder;
