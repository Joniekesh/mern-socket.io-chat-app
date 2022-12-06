import Room from "../models/room.js";
import RoomMessage from "../models/roommessage.js";

// @desc   Create Room
// @route  POST /api/rooms
// @access Private
export const createRoom = async (req, res) => {
	const newRoom = new Room({
		roomAdmin: req.user.id,
		roomName: req.body.roomName,
		roomImg: req.body.roomImg,
	});

	try {
		const savedRoom = await newRoom.save();

		savedRoom.members.push(req.user.id);
		await savedRoom.save();
		res.status(201).json(savedRoom);
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Get Loggedin User Rooms
// @route  GET /api/rooms
// @access Private
export const getUserRooms = async (req, res) => {
	try {
		const rooms = await Room.find({
			members: { $in: [{ _id: req.user.id }] },
		}).populate("roomAdmin", ["_id", "fullName", "img"]);

		if (rooms.length === 0)
			return res.status(404).json({ msg: "Rooms not found" });

		res.status(200).json(rooms);
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Get Room By ID
// @route  GET /api/rooms/:id
// @access Private
export const getRoomById = async (req, res) => {
	try {
		const room = await Room.findById(req.params.id).populate("roomAdmin", [
			"_id",
			"fullName",
			"img",
		]);

		if (!room) return res.status(404).json({ msg: "Room not found" });

		res.status(200).json(room);
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Join Room
// @route  PUT /api/rooms/:id
// @access Private
export const joinRoom = async (req, res) => {
	try {
		const room = await Room.findById(req.params.id);

		if (!room) return res.status(404).json({ msg: "Room not found" });

		const roomMember = room.members.find(
			({ _id }) => _id.toString() === req.body.userId
		);

		if (!roomMember) {
			const updatedRoom = await Room.findByIdAndUpdate(
				req.params.id,
				{ $push: { members: { _id: req.body.userId } } },
				{ new: true }
			);
			return res.status(200).json(updatedRoom);
		} else {
			return res.status(200).json(room);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Leave Room
// @route  PUT /api/rooms/:id/leave
// @access Private
export const leaveRoom = async (req, res) => {
	try {
		const room = await Room.findById(req.params.id);

		if (!room) return res.status(404).json({ msg: "Room not found" });

		const roomMember = room.members.find(
			({ _id }) => _id.toString() === req.body.userId
		);

		if (roomMember) {
			await Room.findByIdAndUpdate(
				req.params.id,
				{ $pull: { members: { _id: req.body.userId } } },
				{ new: true }
			);
			return res.status(200).json({
				msg: "You have left the room.",
			});
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc  Get All Room Members
// @route  GET /api/rooms/:id/members
// @access Private
export const getRoomMembers = async (req, res) => {
	try {
		const room = await Room.findById(req.params.id);

		if (!room) return res.status(404).json({ msg: "Room not found" });

		const roomMember = room.members.find(
			({ _id }) => _id.toString() === req.user.id
		);

		if (!roomMember) {
			res
				.status(401)
				.json({ msg: "You are not authorized to access this route" });
		} else {
			res.status(200).json(room.members);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc  Delete Room (Room Admin Only)
// @route  DELETE /api/rooms/:id
// @access Private
export const deleteRoom = async (req, res) => {
	try {
		const room = await Room.findById(req.params.id);
		if (room.roomAdmin._id.toString() === req.user.id) {
			await Room.findByIdAndDelete(req.params.id);
			await RoomMessage.deleteMany({ roomId: room._id });
			res.status(200).json({ msg: "Room deleted" });
		} else {
			res
				.status(401)
				.json({ msg: "You are not authorized to delete this room" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc  Update Room (Room Admin Only)
// @route  PUT /api/rooms/:id/update
// @access Private
export const updateRoom = async (req, res) => {
	try {
		const room = await Room.findById(req.params.id);

		if (room.roomAdmin._id.toString() === req.user.id) {
			const updatedRoom = await Room.findByIdAndUpdate(
				req.params.id,
				{ $set: req.body },
				{ new: true }
			);

			res.status(200).json({ msg: "Room Updated", updatedRoom });
		} else {
			res.status(401).json({ msg: "You are not allowed to update this room" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc  Remove User From Room (Room Admin Only)
// @route  PUT /api/rooms/:id/removeUser
// @access Private
export const romoveUser = async (req, res) => {
	try {
		const room = await Room.findById(req.params.id);

		if (!room) return res.status(404).json({ msg: "Room not found" });

		if (room.roomAdmin._id.toString() === req.user.id) {
			room.members = room.members.filter(
				({ _id }) => _id.toString() !== req.body.userId
			);

			await room.save();
			res.status(200).json({ msg: "User Removed", room });
		} else {
			res.status(401).json({ msg: "You are not allowed to update this room" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc  Add Message to Room
// @route  PUT /api/rooms/:roomId/messages
// @access Private
export const addMessage = async (req, res) => {
	const newMessage = {
		user: req.user.id,
		img: req.body.img,
		text: req.body.text,
	};
	try {
		const room = await Room.findById(req.params.id);

		if (!room) return res.status(404).json({ msg: "Room not found" });

		const roomMember = room.members.find(({ id }) => id === req.user.id);

		if (!roomMember) {
			return res
				.status(401)
				.json({ msg: "Only room members can send messages to this room" });
		} else {
			room.messages.unshift(newMessage);
			await room.save();

			res.status(200).json(room);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc  Delete Room Message
// @route  DELETE /api/rooms/:roomId/:messageId
// @access Private
export const deleteMessage = async (req, res) => {
	try {
		const room = await Room.findById(req.params.roomId);

		if (!room) return res.status(404).json({ msg: "Room not found" });

		const roomMember = room.members.find(({ id }) => id === req.user.id);

		if (!roomMember)
			return res
				.status(401)
				.json({ msg: "Only room members can delete messages" });

		//Pull out a message from the room
		const message = room.messages.find(
			(message) => message._id.toString() === req.params.messageId
		);

		if (!message) return res.status(404).json({ msg: "Message not found" });

		if (message.user.toString() !== req.user.id) {
			return res
				.status(401)
				.json({ msg: "You are not authorized to delete this message" });
		}

		await message.remove();
		await room.save();
		res.status(200).json({ msg: "Message deleted" });
	} catch (err) {
		res.status(500).json(err);
	}
};
