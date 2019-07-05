const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
//exxpress validator
const { check, validationResult } = require("express-validator/check");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

/**
 * @route   GET api/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);
    //if profile not found send msg
    if (!profile) {
      return res.status(400).json({ msg: "There's no profile for this user" });
    }
    //if found then send it
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}); //end of the "me" profile
/**
 * @route   POST api/profile
 * @desc    create or update a user profile
 * @access  Private
 */

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    /**
     * pull everything from the body
     */
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;
    //build profile OBJ to save to the DB
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }
    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      /**
       * if profile exists in DB, Update it
       */
      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        /**
         * return the whole profile
         */
        return res.json(profile);
      } //end if

      // Create
      profile = new Profile(profileFields);
      //save the profile to the DB
      await profile.save();
      //return the perofile
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
); //end of the post profile, create and update

/**
 * @route   GET api/profile
 * @desc    Get all user sprofile
 * @access  Public
 */

/**
 * no need to auth or any middleware
 */
router.get("/", async (req, res) => {
  try {
    //get all profiles with names and avatar using the Profile model
    //and populate it with the user
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    //send/return all profiles
    res.send(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  } //end try-catch
}); //end of get all profiles

/**
 * @route   GET api/profile/user/:user_id
 * @desc    Get profile by user ID
 * @access  Public
 */

/**
 * no need to auth or any middleware
 */
router.get("/user/:user_id", async (req, res) => {
  try {
    //get user profile with names and avatar using the Profile model
    //and populate it with the user
    //get the ide from the url
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    //check if profile exists
    if (!profile)
      return res.status(400).json({ msg: "There's no profile for this user" });
    //send/return user profile
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    //check if the id is valid
    if (err.kind == "ObjectId") {
      res.status(400).json({ msg: "Profile not found" });
    } //end if
    res.status(500).send("Server Error");
  } //end try-catch
}); //end of get user profile by id
/**
 * @route   DELETE api/profile
 * @desc    Delete profile, user & posts
 * @access  Private
 */

router.delete("/", auth, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
