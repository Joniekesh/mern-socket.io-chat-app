import "./rightBar.scss";

const RightBar = ({ isRoom, room, friend, onlineUsers }) => {
	const isOnline = onlineUsers?.some((ou) => ou.user?._id === friend?._id);

	return (
		<div className="rightBar">
			<span className="cancel">X</span>
			<div className="rightBarContainer">
				{isRoom ? (
					<div className="imgContainer">
						<img
							style={{
								width: "100px",
								height: "100px",
								objectFit: "cover",
								borderRadius: "10px",
							}}
							src={"/assets/" + room?.roomImg}
							alt=""
						/>
					</div>
				) : (
					<div className="imgContainer">
						<img
							src={friend?.img}
							alt=""
							style={{
								width: "100px",
								height: "100px",
								objectFit: "cover",
								borderRadius: "50%",
								border: "2px solid #002e94",
							}}
						/>
						{isOnline && <span className="indicator"></span>}
					</div>
				)}
				{isRoom ? (
					<div className="userInfo">
						<h4>{room?.roomName}</h4>
					</div>
				) : (
					<div className="userInfo">
						<h4>{friend?.fullName}</h4>
						<span>Media Analyst</span>
					</div>
				)}
				{!isRoom && (
					<div className="userFriends">
						<span>Friends</span>
						<div className="images">
							<img src="/assets/profile.jpeg" alt="" />
							<img src="/assets/profile.jpeg" alt="" />
							<img src="/assets/profile.jpeg" alt="" />
							<img src="/assets/profile.jpeg" alt="" />
							<img src="/assets/profile.jpeg" alt="" />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default RightBar;
