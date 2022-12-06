import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/auth.js";

// @desc   Get User By ID
// @route  GET /api/users/:id
// @access Private
export const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password");

		if (!user) return res.status(404).json({ msg: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		if (err.kind === "ObjectId") {
			return res.status(404).json({ msg: "User not found" });
		}
		res.status(500).json(err);
	}
};

// @desc   Update user
// @route  PUT /api/users/me
// @access Private
export const updateUser = async (req, res) => {
	const { fullName, email, phone, password, img, bio } = req.body;

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);

	try {
		const user = await User.findById(req.user.id);

		if (user) {
			user.fullName = fullName || user.fullName;
			user.email = email || user.email;
			user.phone = phone || user.phone;
			user.img = img || user.img;
			user.bio = bio || user.bio;

			if (password) {
				user.password = hash;
			}

			await user.save();

			res.status(200).json({
				user,
				token: generateToken(user._id),
			});
		} else {
			res.status(404).json({ msg: "User not found" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Delete user
// @route  DELETE /api/users/me
// @access Private
export const deleteUser = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.user.id);

		res.status(200).json({ msg: "User deleted" });
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Search user
// @route  GET /api/users/search
// @access Private
export const search = async (req, res) => {
	try {
		const users = await User.find();

		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
};
