import "./friendChatBoxItem.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { FaEllipsisV } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { BiTrashAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const FriendChatBoxItem = ({
	message,
	own,
	id,
	messages,
	setMessages,
	socket,
}) => {
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [roomId, setRoomId] = useState(null);
	const [room, setRoom] = useState(null);

	const { currentUser } = useContext(AuthContext);
	const TOKEN = currentUser?.token;

	const navigate = useNavigate();

	const isValidHttpUrl = (string) => {
		let url;
		try {
			url = new URL(string);
		} catch (_) {
			return false;
		}
		return url.protocol === "http:" || url.protocol === "https:";
	};

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axiosInstance.get(`/users/${message.user}`, config);
				setUser(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchUser();
	}, [message.user]);

	const handleDelete = async (messageId) => {
		try {
			await axiosInstance.delete(`/messages/${id}/${messageId}`, config);
			setMessages(messages.filter((message) => message._id !== messageId));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (isValidHttpUrl(message.text)) {
			setRoomId(message.text.split("/")[4]);
		}
	}, [message.text, roomId]);

	useEffect(() => {
		const fetchRoom = async () => {
			try {
				const res = await axiosInstance.get(`/rooms/${roomId}`, config);
				res.status === 200 && setRoom(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchRoom();
	}, [roomId]);

	const joinRoom = async () => {
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${TOKEN}`,
			},
		};

		try {
			const res = await axiosInstance.put(
				`/rooms/${room._id}`,
				{ userId: currentUser?.user._id },
				config
			);
			res.status === 200 && navigate(`/room/${res.data._id}`);
		} catch (error) {
			console.log(error);
		}

		socket.emit("joinRoom", {
			_id: currentUser?.user._id,
			room,
		});
	};

	return (
		<div className={own === message.user ? "messageItem own" : "messageItem"}>
			<div className="itemDetails">
				<div
					className={own === message.user ? "messageLeft own" : "messageLeft"}
				>
					<img src={user?.img || "/assets/" + user?.img} alt="" />
				</div>
				<div className="messageRight">
					{open && (
						<div className="deletEdit">
							<div
								className="delItem delete"
								onClick={() => handleDelete(message._id)}
							>
								<span>Delete</span>
								<BiTrashAlt />
							</div>
							<div className="delItem edit">
								<span>Edit</span>
								<CiEdit />
							</div>
						</div>
					)}
					<div className={own === message.user ? "topSide own" : "topSide"}>
						<span
							className={own === message.user ? "username own" : "username"}
						>
							{user?.fullName}
						</span>
						<span className="messageTime">
							{new Date(message.createdAt).toLocaleString()}
						</span>
						<span className={own === message.user ? "you own" : "you"}>
							You
						</span>
						{message.user === currentUser?.user._id && (
							<span>
								<FaEllipsisV
									style={{
										color: "white",
										cursor: "pointer",
									}}
									onClick={() => setOpen(!open)}
								/>
							</span>
						)}
					</div>
					<div className="msgTextDiv">
						{message?.img && (
							<img
								src={"/assets/" + message?.img}
								alt=""
								style={{
									width: "100%",
									height: "150px",
									marginRight: "20px",
									borderRadius: "8px",
									marginBottom: "6px",
									objectFit: "cover",
								}}
							/>
						)}
						{message.text &&
							(isValidHttpUrl(message.text) ? (
								<a href={message.text} onClick={joinRoom}>
									<p className={own === message.user ? "text own" : "text"}>
										{message.text.substring(0, 27)}
										<br></br>
										{message.text.substring(27)}
									</p>
								</a>
							) : (
								<p className={own === message.user ? "text own" : "text"}>
									{message.text}
								</p>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FriendChatBoxItem;
