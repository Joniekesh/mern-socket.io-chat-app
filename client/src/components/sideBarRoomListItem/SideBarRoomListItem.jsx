import "./sideBarRoomListItem.scss";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const SideBarRoomListItem = ({ room }) => {
	const [messages, setMessages] = useState([]);
	const [width, setWidth] = useState(window.innerWidth);
	const [height, setHeight] = useState(window.innerHeight);

	const updateDimensions = () => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	};
	useEffect(() => {
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	const mobile = width <= 600;

	const navigagte = useNavigate();

	const lastMessage = messages.sort(
		(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
	);

	const { currentUser, setCurrentChat } = useContext(AuthContext);
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

	const handleNavigate = () => {
		navigagte(`/room/${room._id}`);
		setCurrentChat(true);
	};

	return (
		<div onClick={handleNavigate}>
			<div className="listItem">
				<div className="left">
					<div className="imageDiv">
						<img
							src={
								room?.roomImg
									? "/assets/" + room?.roomImg
									: "https://bit.ly/3XMzjAQ"
							}
							alt=""
						/>
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
		</div>
	);
};

export default SideBarRoomListItem;
