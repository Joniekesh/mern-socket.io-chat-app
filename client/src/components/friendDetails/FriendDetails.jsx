import "./friendDetails.scss";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { useContext, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";
import Loader from "../loader/Loader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FriendDetails = ({ setOpen, friend }) => {
	const [user, setUser] = useState(null);
	const [conversation, setConversation] = useState(null);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const { currentUser, onlineUsers } = useContext(AuthContext);
	const TOKEN = currentUser?.token;

	const isOnlineUser = onlineUsers?.some((ou) => ou?._id === user?._id);

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			try {
				const res = await axiosInstance.get(`/users/${friend._id}`, config);
				setUser(res.data);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.log(error);
			}
		};
		fetchUser();
	}, [friend._id]);

	useEffect(() => {
		const fetchConversation = async () => {
			try {
				const res = await axiosInstance.get(
					`/conversations/${currentUser?.user?._id}/${user?._id}`,
					config
				);
				setConversation(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchConversation();
	}, [currentUser?.user?._id, user?._id]);

	const handleDelete = async () => {
		if (window.confirm("Are you sure? This cannot be undone!")) {
			try {
				const res = await axiosInstance.delete(
					`/conversations/${conversation[0]._id}`,
					config
				);
				if (res.status === 200) {
					setOpen(false);
					navigate("/");
					toast.success("Disconnection Success", { theme: "colored" });
				}
			} catch (error) {
				console.log(error);
				toast.error("Error with disconnection", { theme: "colored" });
			}
		}
	};

	return (
		<div className="main">
			{loading ? (
				<Loader />
			) : (
				<div className="friendDetails">
					<span onClick={() => setOpen(false)}>X</span>
					<div className="container">
						<div className="imgDiv">
							<img
								src={
									user?.img ? "/assets/" + user?.img : "https://bit.ly/3VlFEBJ"
								}
								alt=""
							/>
							{isOnlineUser && <span className="onlineIndicator"></span>}
						</div>
						<div className="item">
							<FaUserAlt />
							<p>{user?.fullName}</p>
						</div>
						<div className="item">
							<MdEmail />
							<p>{user?.email}</p>
						</div>
						{user?.phone && (
							<div className="item">
								<BsFillTelephoneFill />
								<p>{user?.phone}</p>
							</div>
						)}
						{user?.bio?.length > 0 && (
							<div className="item">
								{user?.bio < 50 ? (
									<p>{user.bio}</p>
								) : (
									<p>{user.bio?.slice(0, 30)}...</p>
								)}
							</div>
						)}
						<div
							onClick={handleDelete}
							className="item delBtn"
							style={{
								padding: "5px",
								backgroundColor: "crimson",
								color: "white",
								cursor: "pointer",
								borderRadius: "5px",
								marginTop: "10px",
							}}
						>
							Disconnect
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default FriendDetails;
