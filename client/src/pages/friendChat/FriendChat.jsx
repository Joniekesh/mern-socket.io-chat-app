import "./friendChat.scss";
import { useContext, useState, useRef } from "react";
import LeftBar from "../../components/leftBar/LeftBar";
import RightBar from "../../components/rightBar/RightBar";
import { BsTelephone } from "react-icons/bs";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { ImArrowLeft2 } from "react-icons/im";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FriendChatBoxItem from "../../friendChatBoxItem/FriendChatBoxItem";
import { useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../../components/loader/Loader";
import FriendDetails from "../../components/friendDetails/FriendDetails";
import { BsFileEarmarkImage } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import TypingIndicator from "../../components/typingIandicator/TypingIdicator";

const FriendChat = ({
	isRoom,
	setIsRoom,
	friendOpen,
	setFriendOpen,

	socket,
}) => {
	const [text, setText] = useState("");
	const [file, setFile] = useState(null);
	const [conversation, setConversation] = useState(null);
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [open, setOpen] = useState(false);
	const [typing, setTyping] = useState(false);
	const [istyping, setIsTyping] = useState(false);
	const { state } = useLocation();

	const friend = state?.myFriend;

	const { currentUser, currentChat, onlineUsers } = useContext(AuthContext);
	const TOKEN = currentUser?.token;
	const own = currentUser?.user._id;

	const isOnline = onlineUsers?.some((user) => user?._id === friend?._id);

	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);

	const { id } = useParams();
	const scrollRef = useRef();
	const navigate = useNavigate();

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

	useEffect(() => {
		socket?.on("getMessage", (data) => {
			setArrivalMessage({
				conversationId: data.newMessage.conversationId,
				user: data.newMessage.user,
				text: data.newMessage.text,
				img: data.newMessage.img,
				createdAt: Date.now(),
			});
		});
	}, []);

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
	}, [messages]);

	useEffect(() => {
		const fetchConversation = async () => {
			try {
				const res = await axiosInstance.get(`/conversations/${id}`, config);
				setConversation(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchConversation();
	}, [id]);

	useEffect(() => {
		arrivalMessage &&
			conversation?.members.includes(arrivalMessage.user) &&
			setMessages((prev) => [...prev, arrivalMessage]);
	}, [arrivalMessage, conversation]);

	useEffect(() => {
		const fetchMessages = async () => {
			setLoading(true);
			try {
				const res = await axiosInstance.get(`/messages/${id}`, config);
				setMessages(res.data);
				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		};
		fetchMessages();
	}, [id]);

	const handleNavigate = () => {
		navigate(-1);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (text) {
			socket.emit("stop typing", { receiverId: friend._id });
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${TOKEN}`,
				},
			};

			const data = new FormData();
			data.append("file", file);

			const uploadRes = await axiosInstance.post("/upload", data);
			const url = uploadRes.data;

			const newMessage = {
				conversationId: id,
				user: currentUser?.user._id,
				text,
				img: file ? url : "",
			};

			socket?.emit("sendMessage", {
				newMessage,
				receiverId: friend._id,
			});

			try {
				const res = await axiosInstance.post(
					`/messages/${id}`,
					newMessage,
					config
				);
				setMessages([...messages, res.data]);
				res.status === 201 && setText("");
			} catch (error) {
				console.log(error);
			}
		}
	};

	const typingHandler = (e) => {
		setText(e.target.value);

		// if (!socketConnected) return;

		// if (!typing) {
		// 	setTyping(true);
		// 	socket.emit("typing", { receiverId: friend._id });
		// }
		// let lastTypingTime = new Date().getTime();
		// var timerLength = 3000;
		// setTimeout(() => {
		// 	var timeNow = new Date().getTime();
		// 	var timeDiff = timeNow - lastTypingTime;
		// 	if (timeDiff >= timerLength && typing) {
		// 		socket.emit("stop typing", { receiverId: friend._id });
		// 		setTyping(false);
		// 	}
		// }, timerLength);
	};

	return (
		<div className="friendChat">
			<div className="friendChatContainer">
				{!currentChat && !mobile === true && (
					<LeftBar
						isRoom={isRoom}
						setIsRoom={setIsRoom}
						id={id}
						socket={socket}
					/>
				)}
				<div
					className={
						mobile === true && currentChat ? "chatBox mobile" : "chatBox"
					}
				>
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
									cursor: "pointer",
									gap: "5px",
								}}
								onClick={() => setFriendOpen(true)}
							>
								<div className="imgDiv">
									<img
										src={
											friend?.img
												? "/assets/" + friend?.img
												: "https://bit.ly/3VlFEBJ"
										}
										alt=""
									/>
									{isOnline && <span className="onlineIndicator"></span>}
								</div>
								<span
									className="roomName"
									style={{ fontWeight: "700", color: "#150050" }}
									onClick={() => setOpen(true)}
								>
									{friend?.fullName}
								</span>
							</div>
						</div>
						<div className="right">
							<BsTelephone className="icon" />
							<AiOutlineVideoCamera className="icon" />
						</div>
					</div>
					<div className="messages">
						{loading ? (
							<Loader />
						) : messages?.length > 0 ? (
							messages.map((message) => (
								<FriendChatBoxItem
									message={message}
									own={own}
									key={message._id}
									id={id}
									messages={messages}
									setMessages={setMessages}
									socket={socket}
								/>
							))
						) : (
							<div className="noMsgText">
								No messages yet. You can initiate a chat.
							</div>
						)}
						<div ref={scrollRef} />
					</div>

					<div className="bottom">
						<form onSubmit={handleSubmit}>
							{istyping && (
								<div
									className="typing"
									style={{ alignSelf: "flex-start", margin: "10px" }}
								>
									<TypingIndicator />
								</div>
							)}
							<textarea
								className="textArea"
								rows={3}
								type="text"
								placeholder="Type your message here..."
								value={text}
								onChange={typingHandler}
							></textarea>
							<div className="formRight">
								<div
									className="image"
									style={{ cursor: "pointer", color: "#150050" }}
								>
									<label htmlFor="imgInput">
										<BsFileEarmarkImage />
									</label>
									<input
										type="file"
										style={{ display: "none" }}
										id="imgInput"
										onChange={(e) => setFile(e.target.files[0])}
									/>
								</div>
								<button className="submitBtn" type="submit">
									<IoMdSend style={{ color: "#002e94", fontWeight: "700" }} />
								</button>
							</div>
						</form>
					</div>
				</div>
				<RightBar isRoom={isRoom} friend={friend} />
				{open && <FriendDetails setOpen={setOpen} friend={friend} />}
			</div>
		</div>
	);
};

export default FriendChat;
