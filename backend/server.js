import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import roomRoutes from "./routes/room.js";
import conversationRoutes from "./routes/conversation.js";
import messageRoutes from "./routes/message.js";
import roomMessageRoutes from "./routes/roomMessage.js";
import multer from "multer";
dotenv.config();
connectDB();

import {
	addUser,
	removeUser,
	getUser,
	getOnlineUsers,
	joinRoom,
} from "./utils/helperFunctions.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
	socket.on("newUser", ({ _id, fullName, img }) => {
		addUser(_id, socket.id, fullName, img);
		const users = getOnlineUsers();
		io.emit("getUsers", users);

		console.log("Connection established");
	});

	socket.on("sendMessage", ({ newMessage, receiverId }) => {
		const user = getUser(receiverId);
		socket.to(user?.socketId).emit("getMessage", {
			newMessage,
		});
	});

	socket.on("joinRoom", ({ _id, room }) => {
		const user = getUser(_id);
		const joinedRoom = getRoom(room._id);

		socket.join(joinedRoom._id);

		socket.emit("roomMessage", {
			chatImg: "",
			roomId: joinedRoom._id,
			text: `${user.fullName}, Welcome to the room ${joinedRoom.roomName}.`,
			user: {
				_id: joinedRoom.roomAdmin._id,
				fullName: joinedRoom.roomAdmin.fullName,
				img: joinedRoom.roomAdmin.img,
				userName: joinedRoom.roomAdmin.userName,
			},
		});

		socket.broadcast.to(roomName).emit(`roomMessage`, {
			user: "Admin",
			text: `${user.fullName} has joined!`,
		});
	});

	socket.on("createRoomMessage", (chatImg, roomId, text, user) => {
		io.to(roomId).emit("roomMessage", {
			chatImg,
			roomId,
			text,
			user,
		});
	});

	socket.on("disconnect", () => {
		removeUser(socket.id);
		const users = getOnlineUsers();
		io.emit("getUsers", users);

		console.log("Disconnected");
	});
});

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./client/public/assets");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
	const file = req.file;
	res.status(201).json(file?.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/roomMessages", roomMessageRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
	console.log(`SERVER running in ${process.env.NODE_ENV} MODE on PORT ${PORT}`)
);
