const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { json } = require("express");
const jwt = require("jsonwebtoken");
const genTokenandSetCookies = require("../utils/helpers/genTokenandSetCookies");

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
      genTokenandSetCookies(newUser._id, res);
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
    genTokenandSetCookies(user._id, res);
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

module.exports = {
  signup,
  login,
  logout,
};
