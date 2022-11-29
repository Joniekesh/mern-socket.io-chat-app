import Conversation from "../models/conversation.js";

// @desc   Create Conversation
// @route  POST /api/conversations/:firstId/:secondId
// @access Private
export const createConversation = async (req, res) => {
	const newConversation = new Conversation({
		members: [req.body.senderId, req.body.receiverId],
	});
	try {
		const conversations = await Conversation.find({
			members: { $all: [req.params.senderId, req.params.receiverId] },
		});

		if (conversations.length < 1) {
			const savedConversation = await newConversation.save();
			res.status(201).json(savedConversation);
		} else {
			res
				.status(400)
				.json({ msg: "Conversation already exist between two of you" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Get Conversations
// @route  GET /api/conversations
// @access Private
export const getConversations = async (req, res) => {
	try {
		const conversations = await Conversation.find({
			members: { $in: [req.user.id] },
		});
		res.status(200).json(conversations);
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Get Conversation by ID
// @route  GET /api/conversations/:id
// @access Private
export const getConversationById = async (req, res) => {
	try {
		const conversation = await Conversation.findById(req.params.id);

		if (!conversation)
			return res.status(404).json({ msg: "Conversation not found" });
		res.status(200).json(conversation);
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Get Conversation of two users
// @route  GET /api/conversations/:firstUserId/:secondUserId
// @access Private
export const getConversationOfTwoUsers = async (req, res) => {
	try {
		const conversation = await Conversation.find({
			members: { $all: [req.params.firstUserId, req.params.secondUserId] },
		});
		if (!conversation.length > 0) {
			return res.status(404).json({ msg: "Conversation not found" });
		}
		res.status(200).json(conversation);
	} catch (err) {
		res.status(500).json(err);
	}
};
