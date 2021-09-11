const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (user) res.status(400).json({ status: 3, msg: "Username is taken." });
    else {
      const newUser = new User({ username, password });
      bcrypt.genSalt(10, async (err, salt) => {
        if (err) {
          res.status(500).json({ msg: err.message });
        } else {
          try {
            const value = await bcrypt.hash(password, salt);

            newUser.password = value;
            const savedUser = await newUser.save();

            const token = jwt.sign(
              { id: savedUser._id, name: savedUser.name },
              process.env.JWT_KEY,
              { expiresIn: "7d" }
            );
            res.status(201).json({ username: savedUser.username, token });
          } catch (err) {
            res.status(400).json({ msg: err.message });
          }
        }
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res
      .status(400)
      .json({ status: 1, msg: "Please provide username and password" });
  } else {
    User.findOne({ username }, (err, data) => {
      if (err) console.log(err);

      if (!data) {
        res.status(404).json({ status: 0, msg: "User does not exist." });
      } else {
        bcrypt.compare(password, data.password).then((isMatch) => {
          if (isMatch) {
            const token = jwt.sign(
              { id: data._id, username: data.username },
              process.env.JWT_KEY,
              { expiresIn: "7d" }
            );
            res.json({
              token,
              user: {
                username: data.username,
              },
            });
          } else
            res.status(400).json({ status: 2, msg: "Invalid credentials" });
        });
      }
    });
  }
});

router.get("/getUsers", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(
      users.map((user) => {
        return { username: user.username, joined: user.joined, _id: user._id };
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/getCurrentUser", auth, async (req, res) => {
  try {
    const { id, username } = req.user;
    const user = await User.findById(id);

    res.json({
      user: { _id: user._id, username: user.username, joined: user.joined },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
