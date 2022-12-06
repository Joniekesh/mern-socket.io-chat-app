import mongoose from "mongoose";

const RoomMessageSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		roomId: {
			type: String,
			required: true,
		},
		text: {
			type: String,
		},
		chatImg: {
			type: String,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("RoomMessage", RoomMessageSchema);
