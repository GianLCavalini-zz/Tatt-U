const {Schema, model, default: mongoose} = require("mongoose");

const messageSchema = new Schema(
	
    {
        receiverId: {
            type: String,
        },
        senderId: {
            type: String,
        },
        messageImg: { type: String, default: "" },
        text: {
            type: String,
        },
    },
    { timestamps: true },

);


const MessageModel = model("message", messageSchema);












module.exports = MessageModel