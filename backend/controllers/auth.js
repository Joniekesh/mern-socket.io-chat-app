import { generateToken } from "../middleware/auth.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// @desc   Register User
// @route  POST /api/users
// @access Public
export const register = async (req, res) => {
	const { userName, fullName, email, img, phone, password } = req.body;

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);

	const newUser = new User({
		userName,
		fullName,
		email,
		img,
		phone,
		password: hash,
	});

	try {
		const user = await User.findOne({ userName });
		if (user) {
			return res
				.status(400)
				.json({ msg: `A user with username ${user.userName} already exists` });
		}

		const createdUser = await newUser.save();

		res.status(201).json({
			user: createdUser,
			token: generateToken(createdUser._id),
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Login User
// @route  POST /api/users/login
// @access Public
export const login = async (req, res) => {
	const { userName, password } = req.body;
	try {
		const user = await User.findOne({ userName });

		if (!user) return res.status(404).json({ msg: "Invalid Credentials" });

		const isMatch = bcrypt.compareSync(password, user.password);

		if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

		res.status(200).json({ user, token: generateToken(user._id) });
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Get Logged in User Profile
// @route  GET /api/users/me
// @access Private
export const profile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		if (!user) return res.status(404).json({ msg: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
};
