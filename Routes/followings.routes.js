const router = require("express").Router();
const UserModel = require("../Models/User.Model");
const isAuth = require("../Middlewares/isAuth");
const attachCurrentUser = require("../Middlewares/attachCurrentUser");


//get following artists
router.get("/:userId", async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.userId);
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return UserModel.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { name, profilePicture } = friend;
        friendList.push({ name, profilePicture });
      });
      res.status(200).json(friendList)
    } catch (err) {
        console.log(err)
      res.status(500).json(err);
    }
  });
  
  module.exports = router;