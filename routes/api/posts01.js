const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

//import the models
const Post = require("../../models/Posts");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
/**
 * @route   POST api/posts
 * @desc    Create a post
 * @access  Private
 */
router.get(
  "/",
  [
    auth,
    [
      check("text", "Body text is required.")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    } //end if

    try {
    //bring the user from the models
    //don't send the password
    const user = await User.findById(req.user.id).select("-password");
    //create a new post
    //get the text form the body
    const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    }
        const post = await newPost.save();

        //send the post in the response
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server Error")
        
    }//end trycatch

   
  }
);

module.exports = router;
