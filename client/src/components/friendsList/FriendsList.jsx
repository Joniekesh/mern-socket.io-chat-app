import "./friendsList.scss";
import FriendsListItem from "./FriendsListItem";
import Loader from "../loader/Loader";

const FriendsList = ({ friends, friendLoading, onlineUsers }) => {
	return (
		<div className="friendsList">
			{friendLoading ? (
				<Loader />
			) : friends.length > 0 ? (
				friends.map((friend) => (
					<FriendsListItem
						friend={friend}
						key={friend._id}
						id={friend._id}
						onlineUsers={onlineUsers}
					/>
				))
			) : (
				<span
					style={{
						textAlign: "center",
						marginTop: "30px",
						fontSize: "20px",
						opacity: "0.6",
					}}
				>
					No friends yet.<br></br> Please search for some to connect.
				</span>
			)}
		</div>
	);
};

export default FriendsList;
