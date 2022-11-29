import "./friendDetails.scss";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";

const FriendDetails = ({ setFriendOpen, friend }) => {
	return (
		<div className="friendDetails">
			<span onClick={() => setFriendOpen(false)}>X</span>
			<div className="container">
				<div className="imgDiv">
					<img src={friend?.img} alt="" />
				</div>
				<div className="item">
					<FaUserAlt />
					<p>{friend?.fullName}</p>
				</div>
				<div className="item">
					<MdEmail />
					<p>{friend?.email}</p>
				</div>
				{friend?.phone && (
					<div className="item">
						<BsFillTelephoneFill />
						<p>{friend?.phone}</p>
					</div>
				)}
				<div className="item">
					<p>Sofware Engineer majoring in MERN technologies</p>
				</div>
			</div>
		</div>
	);
};

export default FriendDetails;
