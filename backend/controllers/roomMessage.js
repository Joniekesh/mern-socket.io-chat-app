import RoomMessage from "../models/roommessage.js";
import Room from "../models/room.js";

// @desc  Add Message to Room
// @route  POST /api/roomMessages/:id
// @access Private
export const addMessage = async (req, res) => {
	const newMessage = new RoomMessage(req.body);
	try {
		const room = await Room.findById(req.params.id);

		if (!room) return res.status(404).json({ msg: "Room not found" });

		const roomMember = room.members.find(
			({ _id }) => _id.toString() === req.user.id
		);

		if (roomMember) {
			const savedMessage = await newMessage.save();
			return res.status(200).json(savedMessage);
		} else {
			return res
				.status(401)
				.json({ msg: "Only room members can send messages to this room" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc  Get Room Messages By Room ID
// @route  GET /api/roomMessages/:id
// @access Private
export const getRoomMessages = async (req, res) => {
	try {
		const room = await Room.findById(req.params.id);

		if (!room) return res.status(404).json({ msg: "Room not found" });

		const roomMember = room.members.find(
			({ _id }) => _id.toString() === req.user.id
		);

		if (roomMember) {
			const messages = await RoomMessage.find({
				roomId: req.params.id,
			})
				.sort({ createdAt: 1 })
				.populate("user", ["_id", "fullName", "img", "userName"]);

			res.status(200).json(messages);
		} else {
			return res
				.status(401)
				.json({ msg: "Only room members can access this route." });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};
// @desc  Delete a Message By ID
// @route DELETE /api/roomMessages/:roomId/:messageId
// @access Private
export const deleteMessage = async (req, res) => {
	try {
		const room = await Room.findById(req.params.roomId);

		if (!room) return res.status(404).json({ msg: "Room not found" });

		const roomMember = room.members.find(
			({ _id }) => _id.toString() === req.user.id
		);

		if (roomMember) {
			const message = await RoomMessage.findById(req.params.messageId);

			if (message.user._id.toString() === req.user.id) {
				await RoomMessage.findByIdAndDelete({ _id: req.params.messageId });
				return res.status(200).json({ msg: "Message deleted." });
			} else {
				return res
					.status(401)
					.json({ msg: "You can delete only your messages." });
			}
		} else {
			return res
				.status(401)
				.json({ msg: "Only room members can delete messages" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};
