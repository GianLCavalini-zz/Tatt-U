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

router.put("/update-post/:postId", isAuth, attachCurrentUser, async (req, res) => {

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

//delete a post

router.delete("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await post.deleteOne();
			res.status(200).json("the post has been deleted");
		} else {
			res.status(403).json("you can delete only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
//like / dislike a post

router.put("/:id/like", async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json("The post has been liked");
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json("The post has been disliked");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
//get a post

router.get("/:id", async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get timeline posts

router.get("/timeline/all", async (req, res) => {
	try {
		const currentUser = await User.findById(req.body.userId);
		const userPosts = await Post.find({ userId: currentUser._id });
		const friendPosts = await Promise.all(
			currentUser.followings.map((friendId) => {
				return Post.find({ userId: friendId });
			})
		);
		res.json(userPosts.concat(...friendPosts));
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
