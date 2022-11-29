import "./roomChatBoxItem.scss";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { FaEllipsisV } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { BiTrashAlt } from "react-icons/bi";

const RoomChatBoxItem = ({
	message,
	own,
	roomId,
	messages,
	setMessages,
	socket,
}) => {
	const isValidHttpUrl = (string) => {
		let url;
		try {
			url = new URL(string);
		} catch (_) {
			return false;
		}
		return url.protocol === "http:" || url.protocol === "https:";
	};
	// console.log("http://example.com: " + isValidHttpUrl("https://example.com"));
	// console.log("example.com: " + isValidHttpUrl("example.com"));

	const [open, setOpen] = useState(false);

	const { currentUser } = useContext(AuthContext);
	const TOKEN = currentUser?.token;

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	const handleDelete = async (messageId) => {
		try {
			await axiosInstance.delete(
				`/roomMessages/${roomId}/${messageId}`,
				config
			);
			setMessages(messages.filter((message) => message._id !== messageId));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div
			className={own === message.user?._id ? "messageItem own" : "messageItem"}
		>
			<div className="itemDetails">
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
				<div
					className={
						own === message.user?._id ? "messageLeft own" : "messageLeft"
					}
				>
					<img src={message.user?.img} alt="" />
				</div>
				<div className="messageRight">
					<div
						className={own === message.user?._id ? "topSide own" : "topSide"}
					>
						<span
							className={
								own === message.user?._id ? "username own" : "username"
							}
						>
							{message.user?.fullName}
						</span>
						<span className="messageTime">
							{new Date(message.createdAt).toLocaleString()}
						</span>
						<span className={own === message.user?._id ? "you own" : "you"}>
							You
						</span>
						{message.user?._id === currentUser.user?._id && (
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
						{message?.chatImg && (
							<img
								src={"/assets/" + message?.chatImg}
								alt=""
								style={{
									width: "98%",
									height: "150px",
									marginRight: "20px",
									borderRadius: "8px",
									marginBottom: "6px",
								}}
							/>
						)}
						{message.text &&
							(isValidHttpUrl(message.text) ? (
								<a href={message.text}>
									<p
										className={own === message.user?._id ? "text own" : "text"}
									>
										{message.text.substring(0, 27)}
										<br></br>
										{message.text.substring(27)}
									</p>
								</a>
							) : (
								<p className={own === message.user?._id ? "text own" : "text"}>
									{message.text}
								</p>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RoomChatBoxItem;
