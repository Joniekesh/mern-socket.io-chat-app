import "./roomChat.scss";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeftBar from "../../components/leftBar/LeftBar";
import RightBar from "../../components/rightBar/RightBar";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { ImArrowLeft2 } from "react-icons/im";
import RoomChatBoxItem from "../../roomChatBoxItem/RoomChatBoxItem";
import { useRef } from "react";
import SendMessage from "../../sendMessage/SendMessage";
import Loader from "../../components/loader/Loader";
import RoomDetails from "../../components/roomDetails/RoomDetails";

const RoomChat = ({
	isRoom,
	setIsRoom,
	roomOpen,
	setRoomOpen,
	onlineUsers,
	socket,
}) => {
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const scrollRef = useRef();
	const navigate = useNavigate();

	const [messages, setMessages] = useState([]);
	const [room, setRoom] = useState({});

	const [arrivalMessage, setArrivalMessage] = useState(null);

	const { currentUser } = useContext(AuthContext);
	const TOKEN = currentUser?.token;
	const own = currentUser?.user._id;

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	useEffect(() => {
		socket?.on("roomMessage", (data) => {
			setArrivalMessage({
				chatImg: data.chatImg,
				roomId: data.roomId,
				text: data.text,
				user: data.user,
				createdAt: Date.now(),
			});
		});
	}, []);

	console.log(arrivalMessage);

	useEffect(() => {
		arrivalMessage &&
			room?.members.includes({ _id: arrivalMessage.user._id }) &&
			setMessages((prev) => [...prev, arrivalMessage]);
	}, [arrivalMessage, room]);

	useEffect(() => {
		const fetchRoom = async () => {
			const config = {
				headers: {
					Authorization: `Bearer ${TOKEN}`,
				},
			};

			try {
				const res = await axiosInstance.get(`/rooms/${id}`, config);
				setRoom(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchRoom();
	}, [id]);

	useEffect(() => {
		const fetchMessages = async () => {
			const config = {
				headers: {
					Authorization: `Bearer ${TOKEN}`,
				},
			};

			setLoading(true);
			try {
				const res = await axiosInstance.get(`/roomMessages/${id}`, config);
				setMessages(res.data);
				setLoading(false);
			} catch (err) {
				console.log(err.response.data.msg);
				setLoading(false);
			}
		};
		fetchMessages();
	}, [id]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
	}, [messages]);

	const handleNavigate = () => {
		navigate("/");
	};

	const handleLeave = async () => {
		const config = {
			headers: {
				Authorization: `Bearer ${TOKEN}`,
			},
		};

		try {
			const res = await axiosInstance.put(
				`/rooms/${room._id}/leave`,
				{ userId: currentUser?.user._id },
				config
			);
			res.status === 200 && navigate(-1);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="roomChat">
			<div className="roomChatContainer">
				{roomOpen ? (
					<RoomDetails
						setRoomOpen={setRoomOpen}
						room={room}
						onlineUsers={onlineUsers}
					/>
				) : (
					<LeftBar isRoom={isRoom} setIsRoom={setIsRoom} socket={socket} />
				)}
				<div className="chatBox">
					<div className="top">
						<div className="left">
							<ImArrowLeft2
								style={{ fontSize: "20px", cursor: "pointer" }}
								onClick={handleNavigate}
							/>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
									cursor: "pointer",
									textDecoration: "none",
									color: "inherit",
								}}
								onClick={() => setRoomOpen(true)}
							>
								<div className="imgDiv">
									<img
										src={"/assets/" + room?.roomImg || room?.roomImg}
										alt=""
									/>
								</div>

								<span
									className="roomName"
									style={{ fontWeight: "700", color: "#150050" }}
								>
									{room.roomName}
								</span>
							</div>
						</div>
						{room.roomAdmin?._id !== currentUser?.user._id && (
							<div className="right">
								<button onClick={handleLeave}>Leave Room</button>
							</div>
						)}
					</div>
					<div className="messages">
						{loading ? (
							<Loader />
						) : messages?.length > 0 ? (
							messages.map((message, key) => (
								<RoomChatBoxItem
									message={message}
									own={own}
									key={key}
									roomId={room._id}
									messages={messages}
									room={room}
									setMessages={setMessages}
									socket={socket}
								/>
							))
						) : (
							<p className="noMsgText">
								No messages yet.<br></br> You can initiate a chat.
							</p>
						)}
						<div ref={scrollRef} />
					</div>
					<div className="bottom">
						<SendMessage
							id={room._id}
							setMessages={setMessages}
							messages={messages}
							socket={socket}
						/>
					</div>
				</div>
				<RightBar isRoom={isRoom} room={room} />
			</div>
		</div>
	);
};

export default RoomChat;
