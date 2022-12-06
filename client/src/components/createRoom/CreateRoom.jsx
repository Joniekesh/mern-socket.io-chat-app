import "./createRoom.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateRoom = ({ setIsCreateRoom }) => {
	const [roomName, setRoomName] = useState("");
	const [createdRoom, setCreatedRoom] = useState(null);

	const { currentUser } = useContext(AuthContext);
	const TOKEN = currentUser?.token;

	const navigate = useNavigate();

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		const newRoom = {
			roomName,
			roomAdmin: currentUser.user._id,
		};

		try {
			const res = await axiosInstance.post("/rooms", newRoom, config);

			if (res.status === 201) {
				setCreatedRoom(res.data);
				setIsCreateRoom(false);
				navigate(`/room/${res.data._id}`);
				toast.success("Room successfully created", { theme: "colored" });
			}
		} catch (error) {
			console.log(error);
			toast.error("Error occured", { theme: "colored" });
		}
	};

	return (
		<div className="main">
			<div className="createRoom">
				<form onSubmit={submitHandler}>
					<input
						type="text"
						placeholder="Create room"
						onChange={(e) => setRoomName(e.target.value)}
						required
					/>
					<div className="buttons">
						<button className="cancel" onClick={() => setIsCreateRoom(false)}>
							CANCEL
						</button>
						<button type="submit" className="create">
							CREATE
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateRoom;
