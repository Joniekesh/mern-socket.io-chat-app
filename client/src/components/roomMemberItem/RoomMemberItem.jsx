import "./roomMemberItem.scss";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RoommemberItem = ({ id, room, setRoom }) => {
	const [myFriend, setMyFriend] = useState({});
	const [conversation, setConversation] = useState([]);
	const { currentUser, onlineUsers } = useContext(AuthContext);
	const TOKEN = currentUser?.token;
	const user = currentUser?.user;

	const isOnline = onlineUsers?.some((ou) => ou._id === myFriend._id);

	const myId = room.memmbers?.find(({ _id }) => _id == user._id);
	console.log(myId);

	const navigate = useNavigate();

	const { _id } = id;

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	useEffect(() => {
		const fetchConvOfTwoUsers = async () => {
			try {
				const res = await axiosInstance.get(
					`/conversations/${_id}/${user._id}`,
					config
				);
				setConversation(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchConvOfTwoUsers();
	}, [_id, user._id]);

	useEffect(() => {
		const fetchFriend = async () => {
			try {
				const res = await axiosInstance.get(`/users/${_id}`, config);
				setMyFriend(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchFriend();
	}, [_id]);

	const handleClick = async () => {
		if (conversation.length > 0) {
			navigate(`/friend/${conversation[0]._id}`, { state: { myFriend } });
		} else {
			try {
				const res = await axiosInstance.post(
					`/conversations/${_id}/${user._id}`,
					{ senderId: user._id, receiverId: _id },
					config
				);
				navigate(`/friend/${res.data._id}`, { state: { myFriend } });
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleRemove = async (id) => {
		try {
			if (window.confirm("Are you SURE? This CANNOT be UNDONE!")) {
				const res = await axiosInstance.put(
					`/rooms/${room._id}/removeUser`,
					{ userId: myFriend._id },
					config
				);
				res.status === 200 &&
					setRoom(room?.members?.filter(({ _id }) => _id !== id));
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="roomMemberItem">
			<div
				className="left"
				onClick={handleClick}
				disabled={room.roomAdmin._id === user._id}
			>
				<div className="singleUserDiv">
					<img
						src={
							myFriend?.img
								? "/assets/" + myFriend?.img
								: "https://bit.ly/3VlFEBJ"
						}
						alt=""
					/>
					{isOnline && user && <span className="onlineIndicator"></span>}
				</div>
				<div className="user">{myFriend?.fullName}</div>
			</div>
			{room.roomAdmin?._id === myFriend._id ? (
				<span className="right">Admin</span>
			) : (
				room.roomAdmin._id === currentUser?.user._id && (
					<span
						onClick={() => handleRemove(myFriend._id)}
						className="right"
						style={{
							fontSize: "12px",
							color: "white",
							backgroundColor: "crimson",
							cursor: "pointer",
						}}
					>
						Remove
					</span>
				)
			)}
		</div>
	);
};

export default RoommemberItem;
