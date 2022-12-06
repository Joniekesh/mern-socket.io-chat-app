import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstace from "../../utils/axiosInstance";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";

const Register = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		email: "",
		userName: "",
		phone: "",
		password: "",
		confirmPassword: "",
	});

	const navigate = useNavigate();

	const { dispatch, isLoading, error, currentUser } = useContext(AuthContext);

	useEffect(() => {
		currentUser && navigate("/");
	}, [currentUser]);

	const handleChange = (e) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (inputs.password !== inputs.confirmPassword) {
			toast.error("Passwords do not match", { theme: "colored" });
		} else {
			dispatch({ type: "REGISTER_REQUEST" });
			try {
				const res = await axiosInstace.post("/auth", inputs);
				dispatch({ type: "REGISTER_SUCCESS", payload: res.data });
				toast.success("Register Successful!", { theme: "colored" });
				res.status === 201 && navigate("/login");
			} catch (err) {
				dispatch({ type: "REGISTER_FAILURE", payload: err.response.data.msg });
				toast.error(error, { theme: "colored" });
			}
		}
	};

	return (
		<div className="register">
			<h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<div className="inputGroup">
					<label>Full Name</label>
					<input
						type="text"
						placeholder="Enter your full name"
						name="fullName"
						onChange={handleChange}
						required
					/>
				</div>
				<div className="inputGroup">
					<label>Email</label>
					<input
						type="email"
						placeholder="Enter your email"
						name="email"
						onChange={handleChange}
						required
					/>
				</div>
				<div className="inputGroup">
					<label>Username</label>
					<input
						type="text"
						placeholder="Enter your username"
						name="userName"
						onChange={handleChange}
						required
					/>
				</div>
				<div className="inputGroup">
					<label>Phone</label>
					<input
						type="text"
						placeholder="Enter your phone number"
						name="phone"
						onChange={handleChange}
					/>
				</div>
				<div className="inputGroup">
					<label>Password</label>
					<input
						type="password"
						placeholder="Enter password"
						name="password"
						onChange={handleChange}
						required
					/>
				</div>
				<div className="inputGroup">
					<label>Confirm Password</label>
					<input
						type="password"
						placeholder="Confirm password"
						name="confirmPassword"
						onChange={handleChange}
					/>
				</div>
				<button type="submit">{isLoading ? <Loader /> : "Register"}</button>
				{error && (
					<span style={{ color: "red", fontWeight: "600" }}>{error}</span>
				)}

				<span>
					Already have an account?
					<Link to="/login">
						<span>Login</span>
					</Link>
				</span>
			</form>
		</div>
	);
};

export default Register;
