import express from "express";
import {
	createMessage,
	getMessageByConversationId,
	getFriendMessages,
	deleteMessageByConversationId,
} from "../controllers/message.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/:id", verifyToken, createMessage);
router.get("/:id", verifyToken, getMessageByConversationId);
router.get("/friend/:id", verifyToken, getFriendMessages);
router.delete("/:id/:messageId", verifyToken, deleteMessageByConversationId);

export default router;
