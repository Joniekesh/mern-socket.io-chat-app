import express from "express";
import {
	createConversation,
	getConversations,
	getConversationById,
	getConversationOfTwoUsers,
	deleteConversation,
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
router.delete("/:id", verifyToken, deleteConversation);

export default router;
