const router = require("express").Router();
const PostModel = require("../Models/Post.Model");
const UserModel = require("../Models/User.Model");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

//CREATE A POST 

router.post("/create", isAuth, attachCurrentUser, async (req, res) => {

    const loggedInUser = req.currentUser;
    
	try {
        if(loggedInUser.role !== "ARTIST") {
            return res.status(400).json({ msg: "Only artists can create a Post!"})
        }
		const createdPost = await PostModel.create({
			...req.body,
		});
        await UserModel.findOneAndUpdate(
            { _id: loggedInUser._id },
            { $push: { post: createdPost } },
            { runValidators: true }
          );
		res.status(200).json(createdPost);
	} catch (err) {
		res.status(500).json(err);
	}
});

// update a post

router.patch("/update-post/:postId", isAuth, attachCurrentUser, async (req, res) => {

    const loggedInUser = req.currentUser;

	try {

		const post = await PostModel.findById(req.params.id);
		if (post.userId === loggedInUser._id) {
			await post.updateOne({ $set: req.body });
			res.status(200).json("the post has been updated");
		} else {
			res.status(403).json("you can update only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

router.delete("/delete-post/:id", isAuth, attachCurrentUser, async (req, res) => {
	
	
	const loggedInUser = req.currentUser;


	try {
	  const post = await PostModel.findById(req.params.id);
	  
		await post.deleteOne();
		res.status(200).json("the post has been deleted");
	 
	} catch (err) {
	  res.status(500).json(err);
	}
  });


  //like a post
  
  router.put("/like/:postId", isAuth, attachCurrentUser, async (req, res) => {

	const loggedInUser = req.currentUser;

	try {

	  const post = await PostModel.findById(req.params.postId);

	  if (!post.likes.includes(req.body.userId)) {
		await post.updateOne({ $push: { likes: loggedInUser._id } });
		res.status(200).json("The post has been liked");
	  } 
	  else {
		await post.updateOne({ $pull: { likes: loggedInUser._id } });
		res.status(200).json("The post has been disliked");
	  }
	} catch (err) {
	  res.status(500).json(err);
	}
  });


  // dislike a post

  router.put("/dislike/:postId", isAuth, attachCurrentUser, async (req, res) => {

	const loggedInUser = req.currentUser;

	try {

	  const post = await PostModel.findById(req.params.postId);


		await post.updateOne({ $pull: { likes: req.body.userId } });
		res.status(200).json("The post has been disliked");
	  
	} catch (err) {
	  res.status(500).json(err);
	}
  });

  //get a post
  
  router.get("/:id", isAuth, attachCurrentUser, async (req, res) => {
	try {
	  const post = await PostModel.findById(req.params.id);
	  res.status(200).json(post);
	} catch (err) {
	  res.status(500).json(err);
	}
  });
  
  //get timeline posts
  
  router.get("/timeline/:artistId", async (req, res) => {
	try {
		const loggedInUser = req.currentUser;
	  const artistPosts = await PostModel.find({ userId: loggedInUser._id });
	  const friendPosts = await Promise.all(
		loggedInUser.followings.map((friendId) => {
		  return PostModel.find({ userId: friendId });
		})
	  );
	  res.status(200).json(userPosts.concat(...friendPosts));
	} catch (err) {
	  res.status(500).json(err);
	}
  });
  	
  //get user's all posts
  
  router.get("/profile/:artistname", async (req, res) => {
	try {
	  const user = await UserModel.findOne({ name: req.params.artistname });
	  const posts = await PostModel.find({ userId: user._id });
	  res.status(200).json(posts);
	} catch (err) {
	  res.status(500).json(err);
	}
  });

  module.exports = router;
