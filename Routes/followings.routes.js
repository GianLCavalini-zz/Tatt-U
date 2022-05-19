const router = require("express").Router();
const UserModel = require("../Models/User.Model");
const isAuth = require("../Middlewares/isAuth");
const attachCurrentUser = require("../Middlewares/attachCurrentUser");


//get following artists
router.get("/", isAuth, attachCurrentUser, async (req, res) => {
    const loggedInUser = req.currentUser;
    try {
      
      const artists = await UserModel.find(loggedInUser.followings)
      res.status(200).json(artists)
  
    } catch (err) {
        console.log(err)
      res.status(500).json(err);
    }
  });
  
  module.exports = router;