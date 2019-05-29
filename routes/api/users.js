const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

/**
 * @route   POST api/users
 * @desc    Register user
 * @access  Public
 */
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //if errors are found return a bad request(400) and show the error(s)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //deconstruct the req.body, use DRY
    const { name, email, password } = req.body;
    try {
      //check user exist?
      let user = await User.findOne({ email });
      //if exists send a bad request to the page
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      //get gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      //create a new user
      user = new User({
        name,
        email,
        avatar,
        password
      });
      //encrypt password using bcryptjs
      //create the "salt" for the password
      const salt = await bcrypt.genSalt(10);
      //create the hash
      user.password = await bcrypt.hash(password, salt);
      //save our user to the DB
      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      //return jsonwebtoken
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error!");
    }
  }
);

module.exports = router;
