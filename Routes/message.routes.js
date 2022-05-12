const router = require("express").Router();
const PostModel = require("../Models/Post.Model");
const UserModel = require("../Models/User.Model");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const MessageModel = require("../Models/Message.model");

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

module.exports = router