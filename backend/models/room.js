import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
	{
		roomAdmin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		roomName: {
			type: String,
			required: true,
		},
		roomImg: {
			type: String,
		},
		members: [
			{
				_id: {
					type: mongoose.Schema.Types.ObjectId,
				},
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
