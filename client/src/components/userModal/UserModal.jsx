import "./userModal.scss";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ProfileContext } from "../../context/ProfileContext";
import axiosInstance from "../../utils/axiosInstance";

const UserModal = ({ setOpen }) => {
	const [edit, setEdit] = useState(false);

	const { currentUser } = useContext(AuthContext);
	const user = currentUser?.user;
	const TOKEN = currentUser?.token;

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [file, setFile] = useState("");
	const [password, setPassword] = useState("");
	const [bio, setBio] = useState("");

	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	const { dispatch: profileDispatch, currentProfile } =
		useContext(ProfileContext);

	useEffect(() => {
		const fetchProfile = async () => {
			profileDispatch({ type: "GET_PROFILE_REQUEST" });
			try {
				const res = await axiosInstance.get("/auth/me", config);
				profileDispatch({ type: "GET_PROFILE_SUCCESS", payload: res.data });
			} catch (error) {
				console.log(error);
				profileDispatch({ type: "GET_PROFILE_FAILURE" });
			}
		};
		fetchProfile();
	}, []);

	const handleUpdate = async (e) => {
		e.preventDefault();

		try {
			const data = new FormData();
			data.append("file", file);
			data.append("upload_preset", "upload");

			const uploadRes = await axiosInstance.post("/upload", data);
			const url = uploadRes.data;

			const updatedUser = {
				user: user._id,
				fullName,
				phone,
				email,
				password,
				bio,
				img: file ? url : "",
			};

			profileDispatch({ type: "UPDATE_PROFILE_REQUEST" });

			try {
				const res = await axiosInstance.put("/users/me", updatedUser, config);
				profileDispatch({ type: "UPDATE_PROFILE_SUCCESS", payload: res.data });
				setOpen(false);
			} catch (error) {
				console.log(error);
				profileDispatch({ type: "UPDATE_PROFILE_FAILURE" });
			}
		} catch (error) {
			console.log(error);
		}
	};

	const navigate = useNavigate();
	// const deleteUser = async () => {
	// 	const config = {
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			Authorization: `Bearer ${TOKEN}`,
	// 		},
	// 	};

	// 	try {
	// 		if (window.confirm("Are ypu SURE? This cannot be undone!")) {
	// 			const res = await axiosInstance.delete("/users/me", config);
	// 			dispatch({ type: "DELETE_USER" });
	// 			window.location.reload();
	// 			res.status === 200 && navigate("/login");
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	return (
		<div className="userModal">
			<div className="userModalContainer">
				<span className="closeBtn" onClick={() => setOpen(false)}>
					X
				</span>
				<form className="userDetails" onSubmit={handleUpdate}>
					{edit ? (
						<div className="inputGroup">
							<label
								htmlFor="imgInput"
								style={{
									fontWeight: "600",
									cursor: "pointer",
									color: "gray",
									border: "1px solid white",
									padding: "2px",
									borderRadius: "5px",
								}}
							>
								Upload Image
							</label>
							<input
								type="file"
								style={{ display: "none" }}
								id="imgInput"
								onChange={(e) => setFile(e.target.files[0])}
							/>
						</div>
					) : (
						<div className="imgDiv">
							<img
								src={
									currentProfile?.img
										? "/assets/" + currentProfile?.img
										: "https://bit.ly/3VlFEBJ"
								}
								alt=""
							/>
							<span className="onlineIndicator"></span>
						</div>
					)}
					{edit ? (
						<div className="inputGroup">
							<label>Full Name:</label>
							<input
								type="text"
								defaultValue={currentProfile?.fullName}
								onChange={(e) => setFullName(e.target.value)}
							/>
						</div>
					) : (
						<div className="userInfo">
							<span className="userInfoTitle">Full Name: </span>
							<span className="desc">
								{currentProfile?.fullName} ({currentProfile?.userName})
							</span>
						</div>
					)}
					{edit ? (
						<div className="inputGroup">
							<label>Email:</label>
							<input
								type="email"
								defaultValue={currentProfile?.email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
					) : (
						<div className="userInfo">
							<span className="userInfoTitle">Email: </span>
							<span className="desc">{currentProfile?.email}</span>
						</div>
					)}
					{edit ? (
						<div className="inputGroup">
							<label>Phone:</label>
							<input
								type="text"
								defaultValue={currentProfile?.phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
						</div>
					) : (
						<div className="userInfo">
							{currentProfile?.phone && (
								<>
									<span className="userInfoTitle">Phone: </span>
									<span className="desc">{currentProfile?.phone}</span>
								</>
							)}
						</div>
					)}
					{edit && (
						<div className="inputGroup">
							<label>Password:</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					)}
					{edit ? (
						<div className="inputGroup">
							<label>Bio:</label>
							<input
								type="text"
								defaultValue={currentProfile?.bio}
								onChange={(e) => setBio(e.target.value)}
							/>
						</div>
					) : (
						<div className="userInfo">
							<span className="userInfoTitle">Bio: </span>
							<span className="desc">{currentProfile?.bio}</span>
						</div>
					)}

					{!edit ? (
						<button className="editButton" onClick={() => setEdit(true)}>
							Edit
						</button>
					) : (
						<div className="editBtns">
							<button className="cancelBtn" onClick={() => setEdit(false)}>
								CANCEL
							</button>
							<button type="submit" className="saveBtn">
								SAVE
							</button>
						</div>
					)}
				</form>
				<button className="deleteAccount">DELETE ACCOUNT</button>
			</div>
		</div>
	);
};

export default UserModal;
