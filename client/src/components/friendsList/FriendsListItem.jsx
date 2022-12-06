import "./friendsListItem.scss";
import { useState } from "react";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const FriendsListItem = ({ friend, id }) => {
	const [myFriend, setMyFriend] = useState(null);
	const [friendMessages, setFriendMessages] = useState([]);

	const { currentUser, onlineUsers } = useContext(AuthContext);
	const TOKEN = currentUser?.token;
	const user = currentUser?.user;

	const friendId = friend.members.find((member) => member !== user._id);
	const isOnlineUser = onlineUsers?.some((user) => user._id === friendId);

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const res = await axiosInstance.get(
					`/messages/friend/${friendId}`,
					config
				);
				setFriendMessages(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchMessages();
	}, [friendId]);

	const friendLastMessage = friendMessages
		.filter((message) => message.user === friendId)
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axiosInstance.get(`/users/${friendId}`, config);
				setMyFriend(res.data);
			} catch (err) {
				console.error(err);
			}
		};
		fetchUser();
	}, [friendId]);

	const navigate = useNavigate();

	const handleNavigate = () => {
		navigate(`/friend/${id}`, { state: { myFriend } });
	};
	return (
		<div className="listItem" onClick={handleNavigate}>
			<div className="left">
				<div className="imageDiv">
					<img
						className="friendimg"
						src={
							myFriend?.img
								? "/assets/" + myFriend?.img
								: "https://bit.ly/3VlFEBJ"
						}
						alt=""
					/>
					{isOnlineUser && <span className="onlineIndicator"></span>}
				</div>
				<div className="textDiv">
					<span className="friendsName">{myFriend?.fullName}</span>
					{friendLastMessage[0]?.text &&
						friendLastMessage[0]?.user !== user._id && (
							<span className="friendLastText">
								{friendLastMessage[0]?.text.slice(0, 30)}...
							</span>
						)}
				</div>
			</div>
			<div className="right">3</div>
		</div>
	);
};

export default FriendsListItem;
