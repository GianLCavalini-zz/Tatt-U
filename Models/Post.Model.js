const { Schema, model, default: mongoose } = require("mongoose");

const postSchema = new Schema({
	owner: {type: mongoose.Types.ObjectId, ref: "User"},
	userId: {type: String},
	desc: {
		type: String,
		max: 500,
	},
	img: {
		type: String,
		required: true
	},
	likes: {
		type: Array
	},
});

const PostModel = model("Post", postSchema);

module.exports = PostModel;
