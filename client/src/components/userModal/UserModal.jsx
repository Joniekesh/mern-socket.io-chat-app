import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import "./userModal.scss";

const UserModal = ({ setOpen }) => {
	const [edit, setEdit] = useState(false);
	const [profile, setProfile] = useState(null);

	const { currentUser, dispatch } = useContext(AuthContext);
	const user = currentUser?.user;
	const TOKEN = currentUser?.token;

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [file, setFile] = useState("");
	const [password, setPassword] = useState("");

	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await axiosInstance.get("/auth/me", config);
				setProfile(res.data);
			} catch (error) {
				console.log(error);
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
				img: file ? url : "",
			};

			const res = await axiosInstance.put("/users/me", updatedUser, config);
			res.status === 200 && window.location.reload();
			console.log(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	const navigate = useNavigate();
	const deleteUser = async () => {
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${TOKEN}`,
			},
		};

		try {
			if (window.confirm("Are ypu SURE? This cannot be undone!")) {
				const res = await axiosInstance.delete("/users/me", config);
				dispatch({ type: "DELETE_USER" });
				window.location.reload();
				res.status === 200 && navigate("/login");
			}
		} catch (error) {
			console.log(error);
		}
	};

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
						<img src={profile?.img} alt="" />
					)}
					{edit ? (
						<div className="inputGroup">
							<label>Full Name:</label>
							<input
								type="text"
								defaultValue={profile?.fullName}
								onChange={(e) => setFullName(e.target.value)}
							/>
						</div>
					) : (
						<div className="userInfo">
							<span>Full Name: </span>
							<span className="desc">
								{profile?.fullName} ({profile?.userName})
							</span>
						</div>
					)}
					{edit ? (
						<div className="inputGroup">
							<label>Email:</label>
							<input
								type="email"
								defaultValue={profile?.email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
					) : (
						<div className="userInfo">
							<span>Email: </span>
							<span className="desc">{profile?.email}</span>
						</div>
					)}
					{edit ? (
						<div className="inputGroup">
							<label>Phone:</label>
							<input
								type="text"
								defaultValue={profile?.phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
						</div>
					) : (
						<div className="userInfo">
							{profile?.phone && (
								<>
									<span>Phone: </span>
									<span className="desc">{profile?.phone}</span>
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
				<button className="deleteAccount" onClick={deleteUser}>
					DELETE ACCOUNT
				</button>
			</div>
		</div>
	);
};

export default UserModal;
