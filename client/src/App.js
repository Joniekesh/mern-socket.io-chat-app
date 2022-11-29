import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Home from "./pages/home/Home";
import RoomChat from "./pages/roomChat/RoomChat";
import FriendChat from "./pages/friendChat/FriendChat";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import { AuthContext } from "./context/AuthContext";
import { io } from "socket.io-client";

const App = () => {
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [socket, setSocket] = useState(null);
	const [isRoom, setIsRoom] = useState(false);
	const [friendOpen, setFriendOpen] = useState(false);
	const [roomOpen, setRoomOpen] = useState(false);

	const { currentUser, isLoading } = useContext(AuthContext);
	const user = currentUser?.user;

	const Private = ({ children }) => {
		return !isLoading && currentUser ? children : <Navigate to="/login" />;
	};

	useEffect(() => {
		setSocket(io("http://localhost:5000"));
	}, []);

	useEffect(() => {
		socket?.emit("newUser", {
			_id: user?._id,
			fullName: user?.fullName,
			img: user?.img,
			userName: user?.userName,
		});
	}, [socket, user]);

	useEffect(() => {
		socket?.on("getUsers", (users) => {
			setOnlineUsers(users);
		});
	}, [socket]);

	return (
		<div className="app">
			<div className="circle"></div>
			<div className="circle2"></div>
			<Router>
				<Routes>
					<Route path="/register" element={<Register />}></Route>
					<Route path="/login" element={<Login />}></Route>
					<Route
						index
						element={
							<Private>
								<Home
									isRoom={isRoom}
									setIsRoom={setIsRoom}
									onlineUsers={onlineUsers}
								/>
							</Private>
						}
					></Route>
					<Route
						path="/room/:id"
						element={
							<Private>
								<RoomChat
									isRoom={isRoom}
									setIsRoom={setIsRoom}
									roomOpen={roomOpen}
									setRoomOpen={setRoomOpen}
									onlineUsers={onlineUsers}
									socket={socket}
								/>
							</Private>
						}
					></Route>

					<Route
						path="/friend/:id"
						element={
							<Private>
								<FriendChat
									isRoom={isRoom}
									setIsRoom={setIsRoom}
									friendOpen={friendOpen}
									setFriendOpen={setFriendOpen}
									socket={socket}
									onlineUsers={onlineUsers}
								/>
							</Private>
						}
					></Route>
				</Routes>
			</Router>
		</div>
	);
};

export default App;
