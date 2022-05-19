const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../Models/User.Model");
const generateToken = require("../Config/jwt.config");
const isAuth = require("../Middlewares/isAuth");
const attachCurrentUser = require("../Middlewares/attachCurrentUser");
const isArtist = require("../Middlewares/isArtist");
const saltRounds = 10;


router.post("/signup", async (req, res) => {
    try {
        
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({
                msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
            });
        }
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        const createdUser = await UserModel.create({
            ...req.body,
            passwordHash: passwordHash,
        });
        delete createdUser._doc.passwordHash;
        return res.status(201).json(createdUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


// USER LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ msg: "Wrong password or account." });
        }
        if (await bcrypt.compare(password, user.passwordHash)) {
            delete user._doc.passwordHash;
            const token = generateToken(user);
            return res.status(200).json({
                token: token,
                user: { ...user._doc },
            });
        } else {
            return res.status(400).json({ msg: "Wrong password or account." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
router.get("/profile", isAuth, attachCurrentUser, (req, res) => {
    return res.status(200).json(req.currentUser);
});

// UPDATE USER PROFILE
router.patch("/update-user-profile", isAuth, attachCurrentUser, async (req, res) => {
  try {
      const loggedInUser = req.currentUser;
      if (req.body.password) {
          try {
              const salt = await bcrypt.genSalt(saltRounds);
              const passwordHash = await bcrypt.hash(password, salt);
              const updatedPassword = await UserModel.findOneAndUpdate(
                { _id: loggedInUser._id },
                { passwordHash: passwordHash },
                { runValidators: true, new: true }
            );
          } catch (err) {
            return res.status(500).json(err);
          }
        }
      const updatedUser = await UserModel.findOneAndUpdate(
          { _id: loggedInUser._id },
          { ...req.body },
          { runValidators: true, new: true }
      );
      delete updatedUser._doc.passwordHash;
      return res.status(200).json(updatedUser);
  } catch (error) {
      console.log(error);
      return res.status(500).json(err)

    }
});
//SOFT DELETE
router.delete(
    "/disable-profile",
    isAuth,
    attachCurrentUser,
    async (req, res) => {
        try {
            const disabledUser = await UserModel.findOneAndUpdate(
                { _id: req.currentUser._id },
                { isActive: false, disabledOn: Date.now() },
                { runValidators: true, new: true }
            );
            delete disabledUser._doc.passwordHash;
            return res.status(200).json(disabledUser);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }
);

// get a user

router.get("/:id", isAuth, attachCurrentUser, async (req, res) => {
	try {
	  const user = await UserModel.findById(req.params.id).populate("post");
	  res.status(200).json(user);
	} catch (err) {
    console.log(err)
	  res.status(500).json(err);
	}
  });
  

//get following artists
router.get("/following-artists", isAuth, attachCurrentUser, async (req, res) => {
  const loggedInUser = req.currentUser;
  try {
    
    const artists = await UserModel.find({ followings: loggedInUser._id})
    res.status(200).json(artists)
  } catch (err) {
      console.log(err)
    res.status(500).json(err);
  }
});

  
  //follow a user
  
  router.put("/follow/:id", isAuth, attachCurrentUser, async (req, res) => {
    const loggedInUser = req.currentUser;
    if (loggedInUser._id !== req.params.id) {

      try {

        
        const artist = await UserModel.findById(req.params.id);
        
        if (!artist.followers.includes(loggedInUser._id)) {
          await artist.updateOne({ $push: { followers: loggedInUser._id } });
          await loggedInUser.updateOne({ $push: { followings: artist._id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        console.log(err)
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  });
  

  //unfollow a user
  

  router.put("/unfollow/:id", isAuth, attachCurrentUser, async (req, res) => {
    const loggedInUser = req.currentUser;
    if (loggedInUser._id !== req.params.id) {
      try {
        const artist = await UserModel.findById(req.params.id);
        
        if (artist.followers.includes(loggedInUser._id)) {
          await artist.updateOne({ $pull: { followers: loggedInUser._id } });
          await loggedInUser.updateOne({ $pull: { followings: artist._id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        console.log(err)
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });

  // get all users

router.get("/", async (req, res) => {
  try {
    const allArtists = await UserModel.find({role: "ARTIST"});

    return res.status(200).json(allArtists);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

  
 



module.exports = router;