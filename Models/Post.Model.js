const { Schema, model, default: mongoose } = require("mongoose");

const postSchema = new Schema({
	autor: {type: mongoose.Types.ObjectId, ref: "User"},
	desc: {
		type: String,
		max: 500,
	},
	img: {
		type: String,
		required: true
	},
	likes: {
		type: Array,
		default: [],
	},
});

const PostModel = model("Post", postSchema);

module.exports = PostModel;
