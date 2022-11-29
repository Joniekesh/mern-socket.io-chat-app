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
			default:
				"http://res.cloudinary.com/joniekesh/image/upload/v1657122047/upload/qw8fkm9pirbdlmyeeefp.jpg",
		},
		phone: {
			type: String,
			default: "",
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("User", UserSchema);
