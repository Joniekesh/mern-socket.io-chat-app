import "./sendMessage.scss";
import { BsFileEarmarkImage } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";

const SendMessage = ({ id, messages, setMessages, socket }) => {
	const [text, setText] = useState("");
	const [file, setFile] = useState("");

	const { currentUser } = useContext(AuthContext);
	const TOKEN = currentUser?.token;

	const handleSubmit = async (e) => {
		e.preventDefault();

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${TOKEN}`,
			},
		};

		const data = new FormData();
		data.append("file", file);

		const uploadRes = await axiosInstance.post("/upload", data);
		const url = uploadRes.data;
		const newMessage = {
			chatImg: file ? url : "",
			roomId: id,
			text,
			user: currentUser?.user._id,
		};

		socket.emit("createRoomMessage", newMessage);

		try {
			const res = await axiosInstance.post(
				`/roomMessages/${id}`,
				newMessage,
				config
			);
			if (res.status === 201) {
				setMessages([...messages, res.data]);
				setText("");
				setFile("");
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<textarea
				className="textArea"
				rows={3}
				type="text"
				placeholder="Type your message here..."
				onChange={(e) => setText(e.target.value)}
				value={text}
			></textarea>
			<div className="formRight">
				<div className="image" style={{ cursor: "pointer", color: "#150050" }}>
					<label htmlFor="imgInput">
						<BsFileEarmarkImage />
					</label>
					<input
						type="file"
						style={{ display: "none" }}
						id="imgInput"
						onChange={(e) => setFile(e.target.files[0])}
					/>
				</div>
				<button className="submitBtn" type="submit">
					<IoMdSend style={{ color: "#002e94", fontWeight: "700" }} />
				</button>
			</div>
		</form>
	);
};

export default SendMessage;
