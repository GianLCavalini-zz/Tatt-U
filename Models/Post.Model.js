const { Schema, model, default: mongoose } = require("mongoose");

const postSchema = new Schema(
	{
		userId: { type: String, required: true },
		desc: {
			type: String,
			max: 500,
			required: true,
		},
		img: {
			type: String,
			
		},
		likes: {
			type: Array,
		},
	},
	{ timestamps: true }
);

const PostModel = model("Post", postSchema);

module.exports = PostModel;
