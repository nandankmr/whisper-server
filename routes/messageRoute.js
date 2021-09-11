const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Message = require("../models/MessageModel");

router.post("/getMessages", auth, (req, res) => {
  try {
    const { id, username } = req.user;
    const { selectedUser } = req.body;
    console.log(selectedUser);
    Message.find(
      {
        from: { $in: [id, selectedUser] },
        to: { $in: [id, selectedUser] },
      },
      (err, messages) => {
        if (err) {
          res.status(404).json({ message: err.message });
        } else {
          res.json(messages);
        }
      }
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
