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
			default:
				"https://images.pexels.com/photos/12685803/pexels-photo-12685803.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
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
