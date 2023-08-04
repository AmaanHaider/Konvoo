const express= require('express');
const postController = require('../controllers/post.controllers');
const validateUser = require('../middlewares/validateUser');
const router = express.Router();



router.get("/:id",postController.getPost)
router.get("/feed", validateUser, postController.getFeedPosts);
router.post("/create", validateUser, postController.createPost);
router.post("/like/:id", validateUser, postController.likeUnlikePost);
router.post("/reply/:id", validateUser, postController.replyToPost);
router.delete("/:id", validateUser, postController.deletePost);



module.exports = router