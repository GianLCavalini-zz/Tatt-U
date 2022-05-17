const { Schema, model, default: mongoose } = require("mongoose");





const UserModel = model("User", userSchema);

module.exports = UserModel;
