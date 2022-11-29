import express from "express";
import {
	getUser,
	updateUser,
	deleteUser,
	search,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.put("/me", verifyToken, updateUser);
router.delete("/me", verifyToken, deleteUser);
router.get("/search", verifyToken, search);
router.get("/:id", verifyToken, getUser);

export default router;
