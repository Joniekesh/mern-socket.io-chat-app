import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
	{
		conversationId: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		text: {
			type: String,
			required: false,
		},
		img: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
