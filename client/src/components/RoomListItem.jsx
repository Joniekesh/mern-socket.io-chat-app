import { Link } from "react-router-dom";

const RoomListItem = ({ room }) => {
	return (
		<Link
			to={`/room/${room._id}`}
			style={{ color: "inherit", textDecoration: "none" }}
		>
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
					<span className="friendsName">{room?.roomName}</span>
				</div>
				<div className="right">3</div>
			</div>
		</Link>
	);
};

export default RoomListItem;
