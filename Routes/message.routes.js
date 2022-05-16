const router = require("express").Router();
const PostModel = require("../models/Post.Model");
const UserModel = require("../models/User.Model");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const MessageModel = require("../models/Message.model");

//CREATE NEW MESSAGE

router.post('/new-message', isAuth, attachCurrentUser, async (req, res) => {
 
 
 
 
    try{
      
      const newMessage = await MessageModel.create(
          {
              owner: req.currentUser._id,
              ...req.body,
              send: new Date(Date.now())
          }
      );
      return res.status(201).json(newMessage)

  } catch(err){
      console.error(err)
      return res.status(500).json(err)
  }
})

// get messages

router.get("/messages/:userId", isAuth, attachCurrentUser, async (req, res) => {
   
    try{
        
        const message = await MessageModel.find({ owner: req.params.userId });

        return res.status(200).json(message);
    } catch(err) {
        console.log(err)
    }
})

// delete a message


router.delete("/delete-message/:messageId", isAuth, attachCurrentUser, async (req, res) => {

    try {

        const message = await MessageModel.findById(req.params.messageId) 
        await message.deleteOne();
        res.status(200).json("the message has been deleted");


    } catch(err) {
        res.status(500).json(err);
    }



})







module.exports = router;