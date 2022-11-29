import "./roomsList.scss";
import Loader from "../../components/loader/Loader";
import SideBarRoomListItem from "../sideBarRoomListItem/SideBarRoomListItem";

const RoomsList = ({ rooms, roomLoading }) => {
	return (
		<div className="friendsList">
			{roomLoading ? (
				<Loader />
			) : rooms.length > 0 ? (
				rooms.map((room) => <SideBarRoomListItem room={room} key={room._id} />)
			) : (
				<span
					style={{
						textAlign: "center",
						marginTop: "30px",
						fontSize: "20px",
						opacity: "0.6",
					}}
				>
					No rooms yet.<br></br> Please create one.
				</span>
			)}
		</div>
	);
};

export default RoomsList;
