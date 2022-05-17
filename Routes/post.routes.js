const router = require("express").Router();
const PostModel = require("../Models/Post.Model");
const UserModel = require("../Models/User.Model");
const isAuth = require("../Middlewares/isAuth");
const attachCurrentUser = require("../Middlewares/attachCurrentUser");

//CREATE A POST 

router.post("/create", isAuth, attachCurrentUser, async (req, res) => {

    
    
	try {
		const loggedInUser = req.currentUser;
        if(loggedInUser.role === "USER") {
            return res.status(400).json({ msg: "Only artists can create a Post!"})
        }
		const createdPost = await PostModel.create({
			...req.body,
			userId: loggedInUser._id
		});
        await UserModel.findOneAndUpdate(
            { _id: loggedInUser._id },
            { $push: { post: createdPost } },
            { runValidators: true, new: true }
          );
		res.status(200).json(createdPost);
	} catch (err) {
		console.log(err)
		res.status(500).json(err);
	}
});

// update a post

router.put("/update-post/:id", isAuth, attachCurrentUser, async (req, res) => {

	
	
	try {

		
		const updatedPost = await PostModel.findOneAndUpdate(
            { _id: req.params.id },
            { ...req.body },
            { runValidators: true, new: true }
        );

		res.status(200).json(updatedPost);
	} catch (err) {
		console.log(err)
	  res.status(500).json(err);
	}
  });


// delete a post
router.delete("/delete-post/:id", isAuth, attachCurrentUser, async (req, res) => {
	
	
	const loggedInUser = req.currentUser;

	const {id} = loggedInUser;
	try {
	  	
	  const post = await PostModel.findById(req.params.id);
	  if( id === post.userId ) {
		await post.deleteOne();
		res.status(200).json("the post has been deleted");
	  }
	  else {
		  return res.status(400).json({msg: "You can only delete your posts"})
	  }
	} catch (err) {
	console.log(err)
	  res.status(500).json(err);
	}
  });


  //like,dislike a post
  
  router.put("/like/:postId", isAuth, attachCurrentUser, async (req, res) => {

	const loggedInUser = req.currentUser;

	try {

	  const post = await PostModel.findById(req.params.postId);

	  if (!post.likes.includes(loggedInUser._id)) {
		await post.updateOne({ $push: { likes: loggedInUser._id } });
		res.status(200).json("The post has been liked");
	  } 
	  else {
		await post.updateOne({ $pull: { likes: loggedInUser._id } });
		res.status(200).json("The post has been disliked");
	  }
	} catch (err) {
	 console.log(err)
	  res.status(500).json(err);
	}
  });


  


  //get a post
  
  router.get("/:id", isAuth, attachCurrentUser, async (req, res) => {
	try {
	  const post = await PostModel.findById(req.params.id).populate("owner");
	  res.status(200).json(post);
	} catch (err) {
		console.log(err)
	  res.status(500).json(err);
	}
  });
  

  //get artist's all posts
  
  router.get("/profile/:artistId", async (req, res) => {
	try {
	  const user = await UserModel.findOneById( req.params.artistId );
	  const posts = await PostModel.find({ userId: user._id });
	  res.status(200).json(posts);
	} catch (err) {
		console.log(err)
	  res.status(500).json(err);
	}
  });







  module.exports = router;
