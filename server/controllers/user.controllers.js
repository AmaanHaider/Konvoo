const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { json } = require("express");
const jwt = require("jsonwebtoken");
const ValidateCookies = require("../middlewares/ValidateCookies");

const signup = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      ValidateCookies(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      });
    } else {
      res.status(400), json({ message: "Invalid USer data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const checkPassword = await bcrypt.compare(password, user?.password || "");

    if (!user || !checkPassword) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }
    ValidateCookies(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    res.status(500), json({ message: error.message });
    console.log(error.message);
  }
};
const logout = async (req, res) => {
  try {
    res.cookie("JWT_TOKEN", "", { maxAge: 1 });
    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500), json({ message: error.message });
    console.log(error.message);
  }
};

const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString())
			return res.status(400).json({ message: "You cannot follow/unfollow yourself" });

		if (!userToModify || !currentUser) return res.status(400).json({ message: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
    console.error("Error in followUnFollowUser:", err);
  };
} 
const updateUser = async (req,res)=>{
  const { name, email, username, password,profilePic,bio } = req.body;
  const userId = req.user._id;
  if(req.params.id !== userId.toString()){
    return res.status(400).json({message:"Your are not allowed to Update other Profiles"});

  }
  
  try {
    let user = await User.findById(userId);
    if(!user){
      return res.status(400).json({message:"User not Found"});
    };
    if(password){
      const hashedPassword = await bcrypt.hash(password,10);
      user.password = hashedPassword
    };

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();
    // const { password, ...responseUser } = user;
        const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic,
      bio: user.bio,
    };

    res.status(200).json({
      message: "Profile Updated SuccessFully",
      user:responseUser,
    });
    
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
    console.error("Error in updatingUser:", err);
  }
}

const getUserProfile = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username }).select("-password").select("-updatedAt");
		if (!user) return res.status(404).json({ message: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}
};

module.exports = {
  signup,
  login,
  logout,
  followUnfollowUser,
  updateUser,
  getUserProfile
};
