import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

// @desc   Create Message
// @route  POST /api/messages
// @Private
export const createMessage = async (req, res) => {
	const newMessage = new Message(req.body);

	try {
		const conversation = await Conversation.findById(req.params.id);

		if (!conversation) return res.status(404).json("Conversation not found");

		const conversationMember = conversation.members.find(
			(id) => id === req.user.id
		);

		if (conversationMember) {
			const savedMessage = await newMessage.save();

			return res.status(201).json(savedMessage);
		} else {
			res.status(401).json({ msg: "Not authorized" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Get Message By Conversation ID
// @route  GET /api/messages/:id
// @Private
export const getMessageByConversationId = async (req, res) => {
	try {
		const conversation = await Conversation.findById(req.params.id);

		if (!conversation) return res.status(404).json("Conversation not found");

		const conversationMember = conversation.members.find(
			(id) => id === req.user.id
		);

		if (conversationMember) {
			const messages = await Message.find({
				conversationId: req.params.id,
			}).sort({ createdAt: 1 });

			if (!messages.length > 0)
				return res.status(404).json({ msg: "Messages not found" });

			res.status(200).json(messages);
		} else {
			res.status(401).json({ msg: "Not authorized" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Get Friend's Messages
// @route  GET /api/messages/friend/:id
// @Private
export const getFriendMessages = async (req, res) => {
	try {
		const messages = await Message.find({ user: req.params.id });

		if (!messages) return res.status(404).json({ msg: "Messages not found" });

		res.status(200).json(messages);
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Delete Message By Conversation ID
// @route  DELETE /api/messages/:id/:messageId
// @Private
export const deleteMessageByConversationId = async (req, res) => {
	try {
		const conversation = await Conversation.findById(req.params.id);

		if (!conversation) return res.status(404).json("Conversation not found");

		const conversationMember = conversation.members.find(
			(id) => id === req.user.id
		);

		if (conversationMember) {
			const messages = await Message.find({
				conversationId: req.params.id,
			});

			if (!messages.length > 0)
				return res.status(404).json({ msg: "Messages not found" });

			//Pull out a message
			const message = messages.find(
				(message) => message._id.toString() === req.params.messageId
			);

			if (!message) return res.status(404).json({ msg: "Message not found" });

			if (message.user.toString() !== req.user.id) {
				return res
					.status(401)
					.json({ msg: "You are not authorized to delete this message" });
			} else {
				await message.remove();
				res.status(200).json({ msg: "Message deleted" });
			}
		} else {
			res.status(401).json({ msg: "Not authorized" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};
