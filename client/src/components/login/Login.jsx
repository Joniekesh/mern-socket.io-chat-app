import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import Loader from "../loader/Loader";

const Login = () => {
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");

	const { currentUser, error, dispatch, isLoading } = useContext(AuthContext);

	const navigate = useNavigate();

	useEffect(() => {
		currentUser && navigate("/");
	}, [currentUser]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		dispatch({ type: "LOGIN_REQUEST" });
		try {
			const res = await axiosInstance.post("/auth/login", {
				userName,
				password,
			});
			dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
			res.status === 200 && navigate("/");
		} catch (err) {
			dispatch({ type: "LOGIN_FAILURE", payload: err.response.data.msg });
		}
	};

	return (
		<div className="register">
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div className="inputGroup">
					<label>Username</label>
					<input
						type="text"
						placeholder="Enter your username"
						onChange={(e) => setUserName(e.target.value)}
						required
					/>
				</div>
				<div className="inputGroup">
					<label>Password</label>
					<input
						type="password"
						placeholder="Enter password"
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit">{isLoading ? <Loader /> : "Login"}</button>
				{error && (
					<span style={{ color: "red", fontWeight: "600" }}>{error}</span>
				)}
				<span>
					Do not have an account?
					<Link to="/register">
						<span>Register</span>
					</Link>
				</span>
			</form>
		</div>
	);
};

export default Login;
