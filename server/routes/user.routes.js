const express= require('express');
const userController = require('../controllers/user.controllers');
const validateUser = require('../middlewares/validateUser');
const router = express.Router();

// auth routes
router.post("/signup",userController.signup);
router.post("/login",userController.login);
router.post("/logout",userController.logout);


router.get("/profile/:username",userController.getUserProfile)
router.post("/follow/:id",validateUser,userController.followUnfollowUser);
router.post("/update/:id",validateUser,userController.updateUser);

// router.post("/unfollow",userController.logout);




module.exports = router