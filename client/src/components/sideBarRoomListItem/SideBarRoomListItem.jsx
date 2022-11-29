import "./sideBarRoomListItem.scss";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const SideBarRoomListItem = ({ room }) => {
	const [messages, setMessages] = useState([]);

	const lastMessage = messages.sort(
		(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
	);

	const { currentUser } = useContext(AuthContext);
	const TOKEN = currentUser?.token;

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const res = await axiosInstance.get(
					`/roomMessages/${room._id}`,
					config
				);
				setMessages(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchMessages();
	}, [room._id]);

	return (
		<Link
			to={`/room/${room._id}`}
			style={{ textDecoration: "none", color: "inherit" }}
		>
			<div className="listItem">
				<div className="left">
					<div className="imageDiv">
						<img src={"/assets/" + room?.roomImg || room?.roomImg} alt="" />
					</div>
					<div className="textDiv">
						<span className="roomName">{room?.roomName}</span>
						{lastMessage[0]?.text &&
							lastMessage[0]?.user._id !== currentUser?.user._id && (
								<span className="roomLastText">
									{lastMessage[0]?.text.slice(0, 30)}...
								</span>
							)}
					</div>
				</div>
				<div className="right">3</div>
			</div>
		</Link>
	);
};

export default SideBarRoomListItem;
