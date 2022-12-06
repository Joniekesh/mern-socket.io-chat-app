import "./leftBar.scss";
import { useState, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IoIosPeople } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { FaEllipsisV } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";

import CreateRoom from "../createRoom/CreateRoom";
import FriendsList from "../friendsList/FriendsList";
import RoomsList from "../roomsList/RoomsList";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import UserModal from "../userModal/UserModal";
import { useNavigate, Link } from "react-router-dom";
import UserListItem from "../userListitem/UserListItem";
import Loader from "../loader/Loader";
import { ProfileContext } from "../../context/ProfileContext";

const LeftBar = ({ isRoom, setIsRoom, socket }) => {
	const [rooms, setRooms] = useState([]);
	const [friends, setFriends] = useState([]);
	const [roomLoading, setRoomLoading] = useState(false);
	const [friendLoading, setFriendLoading] = useState(false);
	const [isCreateRoom, setIsCreateRoom] = useState(false);
	const [open, setOpen] = useState(false);
	const [openSettings, setOpenSettings] = useState(false);
	const [query, setQuery] = useState("");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);

	const { currentUser, dispatch } = useContext(AuthContext);
	const TOKEN = currentUser?.token;

	const navigate = useNavigate();

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	const otherUsers = users.filter((user) => user._id !== currentUser?.user._id);

	const { currentProfile, dispatch: profileDispatch } =
		useContext(ProfileContext);

	useEffect(() => {
		const fetchProfile = async () => {
			profileDispatch({ type: "GET_PROFILE_REQUEST" });
			try {
				const res = await axiosInstance.get("/auth/me", config);
				profileDispatch({ type: "GET_PROFILE_SUCCESS", payload: res.data });
			} catch (error) {
				profileDispatch({ type: "GET_PROFILE_FAILURE" });
				console.log(error);
			}
		};
		fetchProfile();
	}, [profileDispatch]);

	useEffect(() => {
		const fetchRooms = async () => {
			setRoomLoading(true);
			try {
				const res = await axiosInstance.get("/rooms", config);
				setRooms(res.data);
				setRoomLoading(false);
			} catch (err) {
				console.log(err);
				setRoomLoading(false);
			}
		};
		fetchRooms();
	}, []);

	useEffect(() => {
		const fetchFriends = async () => {
			setFriendLoading(true);
			try {
				const res = await axiosInstance.get("/conversations", config);
				setFriends(res.data);
				setFriendLoading(false);
			} catch (error) {
				console.log(error);
				setFriendLoading(false);
			}
		};
		fetchFriends();
	}, []);

	useEffect(() => {
		const fetchUsers = async () => {
			setLoading(true);
			try {
				const res = await axiosInstance.get("/users/search", config);
				setUsers(res.data);
				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		};
		fetchUsers();
	}, []);

	const handleLogout = () => {
		dispatch({ type: "LOGOUT" });
		navigate("/login");
	};

	const handleOpen = () => {
		setOpen(true);
		setOpenSettings(false);
	};

	return (
		<div className="leftBar">
			<div className="top">
				<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
					<span className="logo">JonieChat</span>
				</Link>
				<div className="right">
					{isRoom && (
						<button
							className="create"
							onClick={() => setIsCreateRoom(!isCreateRoom)}
						>
							<AiOutlinePlusCircle
								style={{
									cursor: "pointer",
									fontSize: "20px",
									fontWeight: "700",
								}}
							/>
							<span>Room</span>
						</button>
					)}
					<div className="userDetail" style={{ position: "relative" }}>
						<img
							src={
								currentProfile?.img
									? "/assets/" + currentProfile?.img
									: "https://bit.ly/3VlFEBJ"
							}
							alt=""
						/>
						<span
							className="onlineIndicator"
							style={{
								position: "absolute",
								top: "15px",
								left: "25px",
								backgroundColor: "green",
								width: "8px",
								height: "8px",
								borderRadius: "50%",
							}}
						></span>
					</div>
					<FaEllipsisV
						onClick={() => setOpenSettings(!openSettings)}
						style={{ cursor: "pointer" }}
					/>
				</div>
			</div>
			{openSettings && (
				<div className="settings">
					<span onClick={handleOpen}>Settings</span>
					<span className="logout" onClick={handleLogout}>
						Logout
					</span>
				</div>
			)}
			<div className="bottom">
				<div className="listSearch">
					<div className="list">
						<div className="group" onClick={() => setIsRoom(false)}>
							<BsFillPersonFill />
							<span>Friends</span>
						</div>

						<div className="group" onClick={() => setIsRoom(true)}>
							<IoIosPeople />
							<span>Rooms</span>
						</div>
					</div>
					<div className="search">
						<span>
							<AiOutlineSearch />
						</span>
						<input
							type="text"
							placeholder="Search here..."
							onChange={(e) => setQuery(e.target.value.toLowerCase())}
							value={query}
						/>
					</div>
				</div>
			</div>
			{query.length > 0 ? (
				loading ? (
					<Loader />
				) : (
					<ul className="usersList">
						{otherUsers
							.filter((user) => user.fullName.toLowerCase().includes(query))
							.map((user) => (
								<UserListItem user={user} key={user._id} />
							))}
					</ul>
				)
			) : isRoom ? (
				<RoomsList
					rooms={rooms}
					setIsRoom={setIsRoom}
					roomLoading={roomLoading}
				/>
			) : (
				<FriendsList
					friends={friends}
					setIsRoom={setIsRoom}
					friendLoading={friendLoading}
				/>
			)}

			{isCreateRoom && <CreateRoom setIsCreateRoom={setIsCreateRoom} />}

			{open && <UserModal setOpen={setOpen} />}
		</div>
	);
};

export default LeftBar;
