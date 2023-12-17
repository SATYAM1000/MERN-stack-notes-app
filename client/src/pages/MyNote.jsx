/** @format */

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context-data/Store.jsx";
import { useNavigate } from "react-router-dom";
import "./MyNote.css";
const MyNote = () => {
	const { successNotification, failedNotification, folders,setFolders } = useAppContext();
	console.log("folders : ", folders);
	const token = localStorage.getItem("token");
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};
	const navigate = useNavigate();
	const [showColorPalatte, setShowColorPalatte] = useState(false);
	const [currentFormColor, setcurrentFormColor] = useState("#f6f8fa");
	const [note, setNote] = useState({
		title: "",
		content: "",
		label: "",
		bgColor: "",
		folderLocation:"",
	});

	useEffect(() => {
		const fetchFoldersDetails = async () => {
			try {
				const folderResponse = await axios.get(
					"http://localhost:5000/api/folder/get-folders",
					{ headers }
				);

				if (folderResponse.status === 200) {
					setFolders(folderResponse.data.folders.reverse());
				}
			} catch (error) {
				console.log("Error fetching folders: ", error);
			}
		};
		fetchFoldersDetails();
	}, []);

	const paletteRef = useRef(null);
	useEffect(() => {
		// Event listener to detect clicks on the document
		console.log("set ", showColorPalatte);
		console.log("hello inside useeffect");
		console.log("palette ref ", paletteRef.current);
		const handleClickOutside = (event) => {
			console.log("event: ", event.target);
			console.log("current: ", paletteRef.current);
			console.log(paletteRef.current.contains(event.target));
			if (paletteRef.current && !paletteRef.current.contains(event.target)) {
				// Click occurred outside the color palette, so close it
				console.log(
					"paletterEf.current.conatins",
					paletteRef.current.contains(event.target)
				);
				setShowColorPalatte(false);
			}
		};

		// Add event listener when the palette is open
		if (showColorPalatte) {
			document.addEventListener("click", handleClickOutside);
			console.log("set 2: ", showColorPalatte);
		}

		// Cleanup the event listener on unmount or when palette is closed
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [showColorPalatte]); // Update the dependency array

	// const togglePalette = () => {
	// 	setShowColorPalatte(!showColorPalatte);
	// };

	const handleNewTask = (e) => {
		const { name, value } = e.target;
		console.log(name, " value ", value)
		setNote((prevNote) => ({
			...prevNote,
			[name]: value,
		}));
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		if (token === null) {
			failedNotification("Registration or Login Required");
			navigate("/register");
		}
		console.log("note: ",note);
		try {
			const response = await axios.post(
				"http://localhost:5000/api/notes/create",
				note,
				{ headers }
			);
			if (response.status === 201) {
				successNotification(response.data.msg);
				console.log("Note created successfully");
				setNote({ title: "", content: "", label: "", bgColor: "" });
				if (showColorPalatte === true) {
					setShowColorPalatte(false);
				}
				navigate("/");
			}
		} catch (error) {
			console.log("Note Creation Failed");
			console.log("error: ", error);
			failedNotification(error.response.data.msg);
		}
	};

	const handleColorPalatteClick = () => {
		setShowColorPalatte((showColorPalatte) => !showColorPalatte);
	};

	const handleColorClick = (colorCode) => {
		setNote((prevNote) => ({
			...prevNote,
			bgColor: colorCode,
		}));
		setcurrentFormColor(colorCode);
	};
	const returnBackgroundColorUi = () => {
		const colorCodes = [
			"#faafa8",
			"#f39f76",
			"#fff8b8",
			"#e2f6d3",
			"#b4ddd3",
			"#d4e4ed",
			"#f6e2dd",
			"#e9e3d4",
			"#ffadad",
			"#ffd6a5",
			"#fdffb6",
			"#caffbf",
			"#9bf6ff",
			"#a0c4ff",
			"#bdb2ff",
			"#ffc6ff",
			"#ffb8b8",
			"#ffdbb8",
			"#ffffb1",
			"#e2f0cb",
			"#b5ead7",
			"#c7ceea",
			"#ddb3e2",
			"#ffeded",
			"#ffd6d6",
		];

		return (
			<div className="color-palette">
				{colorCodes.map((color, index) => (
					<div
						key={index}
						title={`Color ${index + 1}`}
						className={`color color${index + 1}`}
						style={{ backgroundColor: color }}
						onClick={() => handleColorClick(color)}></div>
				))}
			</div>
		);
	};
	return (
		<div className="my-note">
			<form
				onSubmit={handleFormSubmit}
				style={{ backgroundColor: currentFormColor }}>
				<div className="title-field">
					<input
						value={note.title}
						name="title"
						onChange={handleNewTask}
						type="text"
						placeholder="Title"
					/>
				</div>
				<div className="content-field">
					<textarea
						value={note.content}
						name="content"
						onChange={handleNewTask}
						placeholder="Content"
						cols="30"
						rows="10"></textarea>
				</div>
				<div className="label-field">
					<input
						value={note.label}
						name="label"
						onChange={handleNewTask}
						type="text"
						placeholder="Label"
						autoComplete="off"
					/>
				</div>
				<div className="folder-input-field">
					<label htmlFor="dropdown">Select a Folder</label>
					<select id="dropdown" name="folderLocation" onChange={handleNewTask}>
					<option value="null" >
								--Select Option--
							</option>
						{folders.map((option, key) => (
							<option key={key} value={option.name} >
								{option.name} 
							</option>
						))}
					</select>
				</div>

				<div className="extra-options " ref={paletteRef}>
					<div className="icons">
						<i title="Reminde me" className="fa-solid fa-bell tooltip"></i>
						<i title="Share" className="fa-solid fa-share tooltip"></i>
						<i
							title="Background Options"
							onClick={handleColorPalatteClick}
							className="fa-solid fa-palette tooltip"></i>
						<i title="Add Image" className="fa-solid fa-image tooltip"></i>
					</div>
					{showColorPalatte && returnBackgroundColorUi()}
					<div className="btns">
						<button type="submit">Save Task</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default MyNote;
