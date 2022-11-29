import express from "express";
import {
	createConversation,
	getConversations,
	getConversationById,
	getConversationOfTwoUsers,
} from "../controllers/conversation.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/:senderId/:receiverId", verifyToken, createConversation);
router.get("/", verifyToken, getConversations);
router.get("/:id", verifyToken, getConversationById);
router.get(
	"/:firstUserId/:secondUserId",
	verifyToken,
	getConversationOfTwoUsers
);

export default router;
