import "./roomDetails.scss";
import { IoIosPeople } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { BsImage } from "react-icons/bs";
import { ImArrowLeft2 } from "react-icons/im";
import RoommemberItem from "../roomMemberItem/RoomMemberItem";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RoomDetails = ({ room, setRoomOpen, onlineUsers }) => {
	const [text, setText] = useState("");
	const [roomName, setRoomName] = useState("");
	const [file, setFile] = useState(null);
	const navigate = useNavigate();
	const [isEdit, setIsEdit] = useState(false);

	const { currentUser } = useContext(AuthContext);
	const TOKEN = currentUser?.token;

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	const copyToClipBoard = (e) => {
		e.preventDefault();
		navigator.clipboard.writeText(window.location.href);

		setText("Link Copied");
	};

	const handleDelete = async () => {
		try {
			if (window.confirm("Are you SURE? This CANNOT be UNDONE!")) {
				const res = await axiosInstance.delete(`/rooms/${room._id}`, config);
				res.status === 200 && navigate(-1);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleUpdate = async (e) => {
		e.preventDefault();

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${TOKEN}`,
			},
		};

		try {
			const data = new FormData();
			data.append("file", file);

			const uploadRes = await axiosInstance.post("/upload", data);
			const url = uploadRes.data;

			const updateData = {
				roomName: roomName || room.roomName,
				roomImg: file ? url : room.roomImg,
			};

			const res = await axiosInstance.put(
				`/rooms/${room._id}/update`,
				updateData,
				config
			);
			res.status === 200 && setIsEdit(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="roomDetails">
			<span className="arrow" onClick={() => setRoomOpen(false)}>
				<ImArrowLeft2 />
			</span>
			<div className="wrapper">
				<div className="search">
					<input type="text" placeholder="Search here..." />
				</div>
				<div className="container">
					<div className="roomTop">
						{room.roomAdmin?._id === currentUser?.user._id && (
							<span onClick={() => setIsEdit(true)}>
								<FiEdit />
							</span>
						)}
						{isEdit ? (
							<div className="inputDiv">
								<label
									htmlFor="inputFile"
									style={{ display: "flex", alignItems: "center" }}
								>
									<BsImage />
									Upload
								</label>
								<input
									className="textInput"
									type="file"
									id="inputFile"
									style={{
										display: "none",
										cursor: "pointer",
									}}
									onChange={(e) => setFile(e.target.files[0])}
								/>
							</div>
						) : (
							<div className="imgDiv">
								<img src={"/assets/" + room?.roomImg || room?.roomImg} alt="" />
							</div>
						)}
						{isEdit ? (
							<div className="inputDiv">
								<input
									type="text"
									defaultValue={room.roomName}
									onChange={(e) => setRoomName(e.target.value)}
								/>
							</div>
						) : (
							<div className="item">
								<h4>{room?.roomName}</h4>
							</div>
						)}
						{isEdit && (
							<div className="btn">
								<button className="canc" onClick={() => setIsEdit(false)}>
									CANCEL
								</button>
								<button className="upd" onClick={handleUpdate}>
									UPDATE
								</button>
							</div>
						)}
					</div>
					<div className="item count">
						<IoIosPeople style={{ fontSize: "24px" }} />
						<p>
							{room.members?.length} member{room.members?.length > 1 ? "s" : ""}
						</p>
					</div>
					{room.roomAdmin?._id === currentUser?.user._id && (
						<button onClick={handleDelete}>Delete Room</button>
					)}
				</div>
				<div className="membersDiv">
					<span>Members</span>
					<span>Online</span>
				</div>
				<hr className="line" />
			</div>
			<div className="membersList">
				{room.members?.map((member) => (
					<RoommemberItem
						id={member}
						key={member._id}
						room={room}
						onlineUsers={onlineUsers}
						members={room.members}
					/>
				))}
			</div>
			{room.roomAdmin?._id === currentUser?.user._id && (
				<div className="roomLink">
					<span>{window.location.href.slice(0, 32)}...</span>
					<button onClick={copyToClipBoard}>Copy Room Link</button>
					{text && (
						<div className="linkText" style={{ color: "green" }}>
							{text}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default RoomDetails;
