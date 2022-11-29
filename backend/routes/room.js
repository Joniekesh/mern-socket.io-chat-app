import express from "express";
import {
	createRoom,
	getUserRooms,
	getRoomById,
	joinRoom,
	leaveRoom,
	getRoomMembers,
	deleteRoom,
	updateRoom,
	romoveUser,
} from "../controllers/room.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createRoom);
router.get("/", verifyToken, getUserRooms);
router.get("/:id", verifyToken, getRoomById);
router.put("/:id", verifyToken, joinRoom);
router.put("/:id/leave", verifyToken, leaveRoom);
router.get("/:id/members", verifyToken, getRoomMembers);
router.delete("/:id", verifyToken, deleteRoom);
router.put("/:id/update", verifyToken, updateRoom);
router.put("/:id/removeUser", verifyToken, romoveUser);

export default router;
