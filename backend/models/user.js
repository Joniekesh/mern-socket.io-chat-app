import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			required: true,
			unique: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		img: {
			type: String,
		},
		phone: {
			type: String,
			default: "",
		},
		password: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
			maxlength: 100,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("User", UserSchema);
