import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { register, login, profile } from "../controllers/auth.js";
const router = express.Router();

router.post("/", register);
router.post("/login", login);
router.get("/me", verifyToken, profile);

export default router;
