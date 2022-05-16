const { Schema, model, default: mongoose } = require("mongoose");


const userSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
		},
		passwordHash: { type: String, required: true },
		profilePicture: { type: String, default: "" },
		birthDate: { type: String, default: "" },
		city: { type: String, default: "", required: true },
		country: { type: String, default: "", required: true },
		state: { type: String, default: "", required: true },
		role: { type: String, enum: ["ADMIN", "USER", "ARTIST"], default: "USER" },
		followings: { type: Array, default: [] },
		followers: { type: Array, default: [] },
		post: { type: mongoose.Types.ObjectId, ref: "Post" },
		contact: {
			type: Number,
			match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
			required: true,
		},
	},
	{ timestamps: true }
);

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  passwordHash: { type: String, required: true },
  profilePicture: { type: String, default:""},
  birthDate: { type: String, default:""},
  city: { type: String, default:"", required: true},
  country: {type: String, default: "", required: true},
  state: { type: String, default:"", required: true},
  role: { type: String, enum: ["ADMIN", "USER", "ARTIST"], default: "USER" },
  followings: { type: Array, default:[]},
  followers: { type: Array, default:[]},
  post: { type: Array, default:[]},
  contact: {type: Number, 
  match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/}


});


const UserModel = model("User", userSchema);

module.exports = UserModel;
