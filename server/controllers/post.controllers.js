const Post = require("../models/post.model");
const User = require("../models/user.model");

const createPost = async (req, res) => {
  try {
    const {text, img}= req.body;
    const postedBy = req.user._id
    if(!postedBy || !text){
        return res.status(400).json({
            message:"PostedBy and Text Fiels Are Required"
        })
    };
    const user = await User.findById(postedBy);
    if(!user){
        return res.status(404).json({message:"User Not Found"})
    };

    if(user._id.toString()!==postedBy.toString()){
        return res.status(404).json({message:"Unauthorized to create Post"})

    };
    const maxLength = 500;
    if(text.length>maxLength){
        return res.status(400).json({message:`Text Must be less than ${maxLength} characters`})
    };

    const newPost = new Post({postedBy,text,img});
    await newPost.save();
    res.status(201).json({message:"Post Created Successfully",newPost})
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in Creating Post: ", err.message);
  }
};

const getPost = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({message:"Post Not Found"})
        };

        res.status(200).json({message:"Post Found",post})
        
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in Getting Post: ", err.message);
      }
};


const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ message: "Unauthorized to delete post" });
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		const userLikedPost = post.likes.includes(userId);
		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ message: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json({ message: "Reply added successfully", post });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const following = user.following;
		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });
		res.status(200).json({ feedPosts });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
module.exports = {
  createPost,
  getPost,deletePost, likeUnlikePost, replyToPost, getFeedPosts
};
