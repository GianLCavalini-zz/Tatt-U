const router = require("express").Router();
const PostModel = require("../Models/Post.Model");
const UserModel = require("../Models/User.Model");
const isAuth = require("../Middlewares/isAuth");
const attachCurrentUser = require("../Middlewares/attachCurrentUser");
const MessageModel = require("../Models/Message.model");



router.post("/:artistId", isAuth, attachCurrentUser, async (req, res) => {
    
    const loggedInUser = req.currentUser;
    try {
        const createdMessage = await MessageModel.create({
		      	receiverId: req.params.artistId,
            senderId: loggedInUser._id,
            text: req.body.text,
            messageImg: req.body.messageImg
			
		});
      res.status(200).json(createdMessage);
      
      
    } catch (err) {
        console.log(err)
      res.status(500).json(err);
    }
  });

// get message between two users

router.get("/:receiverId", isAuth, attachCurrentUser, async (req, res) => {
  const loggedInUser = req.currentUser;
  try {
    const messages = await MessageModel.find({
      senderId: loggedInUser._id,
      receiverId: req.params.receiverId,
    });
    res.status(200).json(messages);
    console.log(messages)
  } catch (err) {
      console.log(err)
    res.status(500).json(err);
  }
});



// delete a message


router.delete("/delete-message/:messageId", isAuth, attachCurrentUser, async (req, res) => {

    try {

        const message = await MessageModel.findById(req.params.messageId) 
        await message.deleteOne();
        res.status(200).json("the message has been deleted");


    } catch(err) {
        console.log(err)
        res.status(500).json(err);
    }



})

module.exports = router;