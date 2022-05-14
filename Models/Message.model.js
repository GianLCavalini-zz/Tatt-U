const {Schema, model, default: mongoose} = require("mongoose");

const messageSchema = new Schema({
    owner: {type: mongoose.Types.ObjectId, ref: "User"},
    message: {type: String, required: true, trim: true},
    send: {type: String}
})

const MessageModel = model("message", messageSchema);












module.exports = MessageModel