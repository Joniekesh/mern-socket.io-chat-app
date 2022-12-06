import "./home.scss";
import LeftBar from "../../components/leftBar/LeftBar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Home = ({ isRoom, setIsRoom }) => {
	const { currentUser } = useContext(AuthContext);

	return (
		<div className="home">
			<div className="homeContainer">
				<LeftBar isRoom={isRoom} setIsRoom={setIsRoom} />
				<div className="welcome">
					<div className="welcomeDetails">
						<span style={{ fontSize: "30px", color: "teal" }}>
							JonieChat App
						</span>
						<br></br>
						<div style={{ margin: "50px 0" }}>
							Welcome,{" "}
							<span style={{ color: "#150050", fontSize: "30px" }}>
								{currentUser.user.fullName}
							</span>
						</div>

						<br></br>
						<span style={{ fontSize: "24px", opacity: "0.7" }}>
							You can search for rooms, friends or create rooms using the plus
							icon in the left bar above.
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
