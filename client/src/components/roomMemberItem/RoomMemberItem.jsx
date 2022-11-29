import "./roomMemberItem.scss";
import { useContext, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoommemberItem = ({ id, room, members, onlineUsers }) => {
	const [myFriend, setMyFriend] = useState({});
	const [conversation, setConversation] = useState([]);
	const { currentUser } = useContext(AuthContext);
	const [roomMembers, setRoomMembers] = useState(members);
	const TOKEN = currentUser?.token;
	const user = currentUser?.user;

	const isOnline =
		onlineUsers.some((user) => user.userId === myFriend._id) ||
		onlineUsers.some((user) => user.userId === user._id);

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
				window.location.replace(`/friend/${res.data._id}`);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleRemove = async () => {
		try {
			if (window.confirm("Are you SURE? This CANNOT be UNDONE!")) {
				const res = await axiosInstance.put(
					`/rooms/${room._id}/removeUser`,
					{ userId: myFriend._id },
					config
				);
				res.status === 200 &&
					setRoomMembers(
						roomMembers?.filter(({ _id }) => _id !== myFriend._id)
					);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="roomMemberItem">
			<div className="left" onClick={handleClick}>
				<div className="singleUserDiv">
					<img src={myFriend?.img} alt="" />
					{isOnline && user && <span className="onlineIndicator"></span>}
				</div>
				<div className="user">{myFriend?.fullName}</div>
			</div>
			{room.roomAdmin?._id === myFriend._id ? (
				<span className="right">Admin</span>
			) : (
				room.roomAdmin._id === currentUser?.user._id && (
					<span
						onClick={handleRemove}
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
