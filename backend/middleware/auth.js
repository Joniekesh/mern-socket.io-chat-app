import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT);
};

export const verifyToken = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];

			if (!token)
				return res.status(404).json({ msg: "No token. Authorization denied" });

			const decoded = await jwt.verify(token, process.env.JWT);

			const user = await User.findById(decoded.id);
			req.user = user;

			next();
		} catch (err) {
			res.status(500).json(err);
		}
	}
};

export const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res
			.status(404)
			.json({ msg: "You are not authorized to access this route" });
	}
};
