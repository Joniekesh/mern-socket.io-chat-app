import "./userListItem.scss";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { FaCheck } from "react-icons/fa";

const UserListItem = ({ user: myFriend }) => {
	const [conversation, setConversation] = useState([]);
	const navigate = useNavigate();

	const { currentUser, onlineUsers } = useContext(AuthContext);
	const TOKEN = currentUser?.token;

	const isOnlineUser = onlineUsers?.some((user) => user._id === myFriend._id);

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	useEffect(() => {
		const fetchConversation = async () => {
			try {
				const res = await axiosInstance.get(
					`/conversations/${currentUser?.user._id}/${myFriend._id}`,
					config
				);
				setConversation(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchConversation();
	}, [currentUser?.user._id, myFriend._id]);

	const handleClick = async () => {
		if (conversation.length > 0) {
			navigate(`/friend/${conversation[0]._id}`, { state: { myFriend } });
		} else {
			try {
				const res = await axiosInstance.post(
					`/conversations/${currentUser?.user._id}/${myFriend._id}`,
					{ senderId: currentUser?.user._id, receiverId: myFriend._id },
					config
				);
				navigate(`/friend/${res.data._id}`, { state: { myFriend } });
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<li className="usersListitem" key={myFriend._id} onClick={handleClick}>
			<div className="left">
				<div className="imgDiv">
					<img
						src={
							myFriend.img
								? "/assets/" + myFriend.img
								: "https://bit.ly/3VlFEBJ"
						}
						alt=""
					/>
					{isOnlineUser && <span className="onlineIndicator"></span>}
				</div>
				<span>{myFriend.fullName}</span>
			</div>
			{conversation[0]?.members.includes(myFriend._id) ? (
				<div className="right">
					<FaCheck style={{ fontWeight: "700", color: "green" }} />
				</div>
			) : (
				<div className="right">
					<button>Connect</button>
				</div>
			)}
		</li>
	);
};

export default UserListItem;
