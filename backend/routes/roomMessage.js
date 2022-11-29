import express from "express";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

import {
	addMessage,
	getRoomMessages,
	deleteMessage,
} from "../controllers/roomMessage.js";

router.delete("/:roomId/:messageId", verifyToken, deleteMessage);
router.post("/:id", verifyToken, addMessage);
router.get("/:id", verifyToken, getRoomMessages);

export default router;
